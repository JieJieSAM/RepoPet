export type WorkflowConclusion =
  | "success"
  | "failure"
  | "cancelled"
  | "skipped"
  | "unknown";

export interface RepoSnapshot {
  owner: string;
  repo: string;
  generatedAt: string;
  defaultBranch: string;
  commitsLast7d: number;
  commitsLast30d: number;
  mergedPrsLast30d: number;
  openIssues: number;
  issuesOpenedLast30d: number;
  issuesClosedLast30d: number;
  latestWorkflowConclusion: WorkflowConclusion;
  workflowSuccessRate30d: number;
  daysSinceLastCommit: number;
  streakDays: number;
  bugfixKeywordCount30d: number;
}
