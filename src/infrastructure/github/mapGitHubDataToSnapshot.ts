import type { ScoringRules } from "../../domain/config/scoringRules.js";
import type { RepoSnapshot } from "../../domain/entities/RepoSnapshot.js";
import type { GitHubActivityRawData } from "../../types/github.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const dateMinusDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() - days);
  return next;
};

const toUtcDayKey = (isoDate: string): string => isoDate.slice(0, 10);
const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const countSince = (dates: Array<string | null>, cutoffIso: string): number => {
  return dates.filter((value): value is string => value !== null && value >= cutoffIso).length;
};

const computeStreakDays = (commitDates: string[]): number => {
  if (commitDates.length === 0) {
    return 0;
  }

  const distinctDays = new Set(commitDates.map((date) => toUtcDayKey(date)));
  const sorted = [...distinctDays].sort().reverse();
  let streak = 0;

  let cursor = new Date(`${sorted[0]}T00:00:00.000Z`);
  for (const day of sorted) {
    const expectedKey = toUtcDayKey(cursor.toISOString());
    if (day !== expectedKey) {
      break;
    }

    streak += 1;
    cursor = dateMinusDays(cursor, 1);
  }

  return streak;
};

export const mapGitHubDataToSnapshot = (
  data: GitHubActivityRawData,
  rules: ScoringRules
): RepoSnapshot => {
  const now = new Date(data.generatedAt);
  const shortCutoffIso = dateMinusDays(now, rules.lookbackWindows.shortWindowDays).toISOString();
  const longCutoffIso = dateMinusDays(now, rules.lookbackWindows.longWindowDays).toISOString();
  const streakCutoffIso = dateMinusDays(now, rules.lookbackWindows.streakWindowDays).toISOString();

  const commitDates = data.commits.map((commit) => commit.committedAt);
  const commitsLast7d = countSince(commitDates, shortCutoffIso);
  const commitsLast30d = countSince(commitDates, longCutoffIso);

  const mergedPrsLast30d = countSince(
    data.pullRequests.map((pullRequest) => pullRequest.mergedAt),
    longCutoffIso
  );

  const issuesOnly = data.issues.filter((issue) => !issue.isPullRequest);
  const issuesOpenedLast30d = countSince(
    issuesOnly.map((issue) => issue.createdAt),
    longCutoffIso
  );
  const issuesClosedLast30d = countSince(
    issuesOnly.map((issue) => issue.closedAt),
    longCutoffIso
  );

  const latestCommitDate = commitDates.sort().at(-1);
  const daysSinceLastCommit = latestCommitDate
    ? Math.max(0, Math.floor((now.getTime() - new Date(latestCommitDate).getTime()) / MS_PER_DAY))
    : rules.lookbackWindows.longWindowDays + 1;

  const streakDays = computeStreakDays(commitDates.filter((date) => date >= streakCutoffIso));
  const bugfixPattern = new RegExp(`\\b(${rules.bugfixKeywords.map(escapeRegex).join("|")})\\b`, "i");
  const bugfixKeywordCount30d = data.commits
    .filter((commit) => commit.committedAt >= longCutoffIso)
    .filter((commit) => bugfixPattern.test(commit.message)).length;

  const workflowRunsLast30d = data.workflowRuns.filter((run) => run.createdAt >= longCutoffIso);
  const successfulRuns = workflowRunsLast30d.filter((run) => run.conclusion === "success").length;
  const countedRuns = workflowRunsLast30d.filter((run) => run.conclusion !== "unknown").length;
  const workflowSuccessRate30d =
    countedRuns === 0 ? 0 : Number(((successfulRuns / countedRuns) * 100).toFixed(2));

  return {
    owner: data.owner,
    repo: data.repo,
    generatedAt: data.generatedAt,
    defaultBranch: data.defaultBranch,
    commitsLast7d,
    commitsLast30d,
    mergedPrsLast30d,
    openIssues: data.openIssuesCount,
    issuesOpenedLast30d,
    issuesClosedLast30d,
    latestWorkflowConclusion: data.latestWorkflowConclusion,
    workflowSuccessRate30d,
    daysSinceLastCommit,
    streakDays,
    bugfixKeywordCount30d
  };
};
