import type { WorkflowConclusion } from "../domain/entities/RepoSnapshot.js";

export interface GitHubCommitActivity {
  message: string;
  committedAt: string;
}

export interface GitHubPullRequestActivity {
  mergedAt: string | null;
}

export interface GitHubIssueActivity {
  createdAt: string;
  closedAt: string | null;
  isPullRequest: boolean;
}

export interface GitHubWorkflowRunActivity {
  conclusion: WorkflowConclusion;
  createdAt: string;
}

export interface GitHubActivityRawData {
  owner: string;
  repo: string;
  generatedAt: string;
  defaultBranch: string;
  commits: GitHubCommitActivity[];
  pullRequests: GitHubPullRequestActivity[];
  issues: GitHubIssueActivity[];
  openIssuesCount: number;
  workflowRuns: GitHubWorkflowRunActivity[];
  latestWorkflowConclusion: WorkflowConclusion;
}

export interface GitHubOwnerRepositoryRaw {
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  description: string | null;
  language: string | null;
  default_branch: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  updated_at: string;
  pushed_at: string;
}
