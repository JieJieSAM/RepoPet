import type { GitHubActivityRawData } from "../../../src/types/github.js";

export const rawActivityFixture: GitHubActivityRawData = {
  owner: "acme",
  repo: "repopet",
  generatedAt: "2026-03-17T00:00:00.000Z",
  defaultBranch: "main",
  commits: [
    { message: "feat: add scoring engine", committedAt: "2026-03-16T10:00:00.000Z" },
    { message: "fix: patch workflow output", committedAt: "2026-03-15T09:30:00.000Z" },
    { message: "docs: update README", committedAt: "2026-03-12T08:00:00.000Z" },
    { message: "hotfix: rollback flaky check", committedAt: "2026-03-02T07:00:00.000Z" },
    { message: "chore: clean scripts", committedAt: "2026-02-18T06:00:00.000Z" }
  ],
  pullRequests: [
    { mergedAt: "2026-03-10T00:00:00.000Z" },
    { mergedAt: "2026-03-01T00:00:00.000Z" },
    { mergedAt: null }
  ],
  issues: [
    { createdAt: "2026-03-01T00:00:00.000Z", closedAt: "2026-03-11T00:00:00.000Z", isPullRequest: false },
    { createdAt: "2026-03-07T00:00:00.000Z", closedAt: null, isPullRequest: false },
    { createdAt: "2026-03-05T00:00:00.000Z", closedAt: "2026-03-09T00:00:00.000Z", isPullRequest: true }
  ],
  openIssuesCount: 9,
  workflowRuns: [
    { conclusion: "success", createdAt: "2026-03-15T00:00:00.000Z" },
    { conclusion: "failure", createdAt: "2026-03-14T00:00:00.000Z" },
    { conclusion: "success", createdAt: "2026-03-12T00:00:00.000Z" }
  ],
  latestWorkflowConclusion: "success"
};
