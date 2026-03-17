import type { RepoSnapshot } from "../../../src/domain/entities/RepoSnapshot.js";
import type { ZooRepository } from "../../../src/domain/zoo/entities/ZooRepository.js";
import type { ZooRepositoryPet } from "../../../src/domain/zoo/entities/ZooRepositoryPet.js";

const makeRepository = (
  name: string,
  overrides: Partial<ZooRepository> = {}
): ZooRepository => ({
  owner: "acme",
  name,
  fullName: `acme/${name}`,
  description: `${name} repository`,
  language: "TypeScript",
  defaultBranch: "main",
  visibility: "public",
  isFork: false,
  isArchived: false,
  updatedAt: "2026-03-17T00:00:00.000Z",
  pushedAt: "2026-03-17T00:00:00.000Z",
  ...overrides
});

const makeSnapshot = (
  name: string,
  overrides: Partial<RepoSnapshot>
): RepoSnapshot => ({
  owner: "acme",
  repo: name,
  generatedAt: "2026-03-17T00:00:00.000Z",
  defaultBranch: "main",
  commitsLast7d: 0,
  commitsLast30d: 0,
  mergedPrsLast30d: 0,
  openIssues: 0,
  issuesOpenedLast30d: 0,
  issuesClosedLast30d: 0,
  latestWorkflowConclusion: "unknown",
  workflowSuccessRate30d: 0,
  daysSinceLastCommit: 30,
  streakDays: 0,
  bugfixKeywordCount30d: 0,
  ...overrides
});

export const zooRepositoryPetsFixture: ZooRepositoryPet[] = [
  {
    repository: makeRepository("core-engine", { language: "TypeScript" }),
    snapshot: makeSnapshot("core-engine", {
      commitsLast7d: 12,
      commitsLast30d: 40,
      mergedPrsLast30d: 11,
      workflowSuccessRate30d: 95,
      daysSinceLastCommit: 0,
      streakDays: 18,
      bugfixKeywordCount30d: 2,
      latestWorkflowConclusion: "success"
    }),
    stats: {
      health: 86,
      mood: 82,
      growth: 88,
      chaos: 24
    },
    stage: "final",
    expression: "proud",
    statusLine: "主力仓库推进顺滑。"
  },
  {
    repository: makeRepository("legacy-api", { language: "Java" }),
    snapshot: makeSnapshot("legacy-api", {
      commitsLast7d: 1,
      commitsLast30d: 6,
      mergedPrsLast30d: 1,
      workflowSuccessRate30d: 52,
      daysSinceLastCommit: 3,
      streakDays: 2,
      bugfixKeywordCount30d: 4,
      latestWorkflowConclusion: "failure"
    }),
    stats: {
      health: 48,
      mood: 38,
      growth: 34,
      chaos: 78
    },
    stage: "baby",
    expression: "chaotic",
    statusLine: "修补节奏重，波动偏高。"
  },
  {
    repository: makeRepository("docs-site", { language: "HTML" }),
    snapshot: makeSnapshot("docs-site", {
      commitsLast7d: 0,
      commitsLast30d: 2,
      mergedPrsLast30d: 0,
      workflowSuccessRate30d: 90,
      daysSinceLastCommit: 25,
      streakDays: 1,
      bugfixKeywordCount30d: 0,
      latestWorkflowConclusion: "success"
    }),
    stats: {
      health: 74,
      mood: 42,
      growth: 20,
      chaos: 18
    },
    stage: "baby",
    expression: "sleepy",
    statusLine: "文档仓库慢热运行。"
  },
  {
    repository: makeRepository("playground", { language: "Python" }),
    snapshot: makeSnapshot("playground", {
      commitsLast7d: 10,
      commitsLast30d: 18,
      mergedPrsLast30d: 4,
      workflowSuccessRate30d: 65,
      daysSinceLastCommit: 0,
      streakDays: 4,
      bugfixKeywordCount30d: 8,
      latestWorkflowConclusion: "failure"
    }),
    stats: {
      health: 61,
      mood: 68,
      growth: 58,
      chaos: 72
    },
    stage: "teen",
    expression: "chaotic",
    statusLine: "实验仓库热闹且不稳定。"
  },
  {
    repository: makeRepository("archive-tool", { language: "Rust" }),
    snapshot: makeSnapshot("archive-tool", {
      commitsLast7d: 0,
      commitsLast30d: 0,
      mergedPrsLast30d: 0,
      workflowSuccessRate30d: 0,
      daysSinceLastCommit: 45,
      streakDays: 0,
      bugfixKeywordCount30d: 0,
      latestWorkflowConclusion: "unknown"
    }),
    stats: {
      health: 35,
      mood: 20,
      growth: 8,
      chaos: 12
    },
    stage: "egg",
    expression: "sleepy",
    statusLine: "长期休眠中。"
  }
];
