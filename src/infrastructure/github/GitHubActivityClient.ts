import { Octokit } from "@octokit/rest";
import type { ScoringRules } from "../../domain/config/scoringRules.js";
import type { WorkflowConclusion } from "../../domain/entities/RepoSnapshot.js";
import type {
  GitHubActivityRawData,
  GitHubCommitActivity,
  GitHubIssueActivity,
  GitHubPullRequestActivity,
  GitHubWorkflowRunActivity
} from "../../types/github.js";

interface LoggerLike {
  info(message: string): void;
  warn(message: string): void;
}

const toDateOrNull = (value: string | null | undefined): string | null => value ?? null;

const toWorkflowConclusion = (value: string | null): WorkflowConclusion => {
  if (value === "success" || value === "failure" || value === "cancelled" || value === "skipped") {
    return value;
  }
  return "unknown";
};

const isRateLimitError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const maybeStatus = (error as { status?: unknown }).status;
  const maybeMessage = (error as { message?: unknown }).message;
  return maybeStatus === 403 && typeof maybeMessage === "string" && maybeMessage.includes("rate limit");
};

export class GitHubActivityClient {
  private readonly octokit: Octokit;
  private readonly owner: string;
  private readonly repo: string;
  private readonly rules: ScoringRules;
  private readonly logger: LoggerLike;

  public constructor(params: {
    token: string;
    owner: string;
    repo: string;
    rules: ScoringRules;
    logger: LoggerLike;
  }) {
    this.octokit = params.token === "__ANON__" ? new Octokit() : new Octokit({ auth: params.token });
    this.owner = params.owner;
    this.repo = params.repo;
    this.rules = params.rules;
    this.logger = params.logger;
  }

  public async fetchActivitySnapshot(generatedAt: string): Promise<GitHubActivityRawData> {
    const longCutoff = new Date(generatedAt);
    longCutoff.setUTCDate(longCutoff.getUTCDate() - this.rules.lookbackWindows.longWindowDays);

    const streakCutoff = new Date(generatedAt);
    streakCutoff.setUTCDate(streakCutoff.getUTCDate() - this.rules.lookbackWindows.streakWindowDays);

    let defaultBranch = "main";
    let openIssuesCount = 0;

    try {
      const repoResponse = await this.octokit.repos.get({
        owner: this.owner,
        repo: this.repo
      });
      defaultBranch = repoResponse.data.default_branch;
    } catch (error: unknown) {
      if (isRateLimitError(error)) {
        throw new Error("GitHub API rate limit reached while fetching repository metadata.");
      }
      throw new Error(`Unable to fetch repository metadata: ${(error as Error).message}`);
    }

    const commits = await this.fetchCommits(defaultBranch, streakCutoff.toISOString());
    const pullRequests = await this.fetchMergedPullRequests(longCutoff.toISOString());
    const issues = await this.fetchIssues(longCutoff.toISOString());
    openIssuesCount = await this.fetchOpenIssueCount();
    const workflowResult = await this.fetchWorkflowRuns(longCutoff.toISOString());

    return {
      owner: this.owner,
      repo: this.repo,
      generatedAt,
      defaultBranch,
      commits,
      pullRequests,
      issues,
      openIssuesCount,
      workflowRuns: workflowResult.workflowRuns,
      latestWorkflowConclusion: workflowResult.latestWorkflowConclusion
    };
  }

  private async fetchCommits(defaultBranch: string, sinceIso: string): Promise<GitHubCommitActivity[]> {
    try {
      const commits = await this.octokit.paginate(this.octokit.repos.listCommits, {
        owner: this.owner,
        repo: this.repo,
        sha: defaultBranch,
        since: sinceIso,
        per_page: 100
      });

      return commits.map((commit) => ({
        message: commit.commit.message,
        committedAt: commit.commit.committer?.date ?? commit.commit.author?.date ?? new Date(0).toISOString()
      }));
    } catch (error: unknown) {
      if (isRateLimitError(error)) {
        throw new Error("GitHub API rate limit reached while fetching commits.");
      }
      throw new Error(`Unable to fetch commits: ${(error as Error).message}`);
    }
  }

  private async fetchMergedPullRequests(cutoffIso: string): Promise<GitHubPullRequestActivity[]> {
    try {
      const mergedPullRequests: GitHubPullRequestActivity[] = [];
      const iterator = this.octokit.paginate.iterator(this.octokit.pulls.list, {
        owner: this.owner,
        repo: this.repo,
        state: "closed",
        sort: "updated",
        direction: "desc",
        per_page: 100
      });

      let pageCount = 0;
      for await (const page of iterator) {
        pageCount += 1;
        for (const pullRequest of page.data) {
          if (!pullRequest.merged_at) {
            continue;
          }

          if (pullRequest.merged_at < cutoffIso) {
            return mergedPullRequests;
          }

          mergedPullRequests.push({ mergedAt: pullRequest.merged_at });
        }

        if (pageCount >= 5) {
          break;
        }
      }

      return mergedPullRequests;
    } catch (error: unknown) {
      this.logger.warn(`Pull request fetch failed, continuing with empty data: ${(error as Error).message}`);
      return [];
    }
  }

  private async fetchIssues(sinceIso: string): Promise<GitHubIssueActivity[]> {
    try {
      const issues = await this.octokit.paginate(this.octokit.issues.listForRepo, {
        owner: this.owner,
        repo: this.repo,
        state: "all",
        since: sinceIso,
        per_page: 100
      });

      return issues.map((issue) => ({
        createdAt: issue.created_at,
        closedAt: toDateOrNull(issue.closed_at),
        isPullRequest: issue.pull_request !== undefined
      }));
    } catch (error: unknown) {
      this.logger.warn(`Issue fetch failed, continuing with empty data: ${(error as Error).message}`);
      return [];
    }
  }

  private async fetchOpenIssueCount(): Promise<number> {
    try {
      const issues = await this.octokit.paginate(this.octokit.issues.listForRepo, {
        owner: this.owner,
        repo: this.repo,
        state: "open",
        per_page: 100
      });
      return issues.filter((issue) => issue.pull_request === undefined).length;
    } catch (error: unknown) {
      this.logger.warn(
        `Open issue count fetch failed, using fallback of 0: ${(error as Error).message}`
      );
      return 0;
    }
  }

  private async fetchWorkflowRuns(
    cutoffIso: string
  ): Promise<{ workflowRuns: GitHubWorkflowRunActivity[]; latestWorkflowConclusion: WorkflowConclusion }> {
    try {
      const response = await this.octokit.actions.listWorkflowRunsForRepo({
        owner: this.owner,
        repo: this.repo,
        per_page: 100,
        created: `>=${cutoffIso}`
      });

      const workflowRuns: GitHubWorkflowRunActivity[] = response.data.workflow_runs.map((run) => ({
        conclusion: toWorkflowConclusion(run.conclusion),
        createdAt: run.created_at
      }));

      const latestRun = response.data.workflow_runs
        .slice()
        .sort((left, right) => right.created_at.localeCompare(left.created_at))[0];

      return {
        workflowRuns,
        latestWorkflowConclusion: latestRun ? toWorkflowConclusion(latestRun.conclusion) : "unknown"
      };
    } catch (error: unknown) {
      const maybeStatus = (error as { status?: number }).status;
      if (maybeStatus === 404) {
        this.logger.info("No workflows detected; continuing with unknown workflow status.");
        return { workflowRuns: [], latestWorkflowConclusion: "unknown" };
      }

      this.logger.warn(`Workflow fetch failed, continuing with unknown status: ${(error as Error).message}`);
      return { workflowRuns: [], latestWorkflowConclusion: "unknown" };
    }
  }
}
