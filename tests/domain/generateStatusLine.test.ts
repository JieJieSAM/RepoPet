import { describe, expect, it } from "vitest";
import { scoringRules } from "../../src/domain/config/scoringRules.js";
import type { RepoSnapshot } from "../../src/domain/entities/RepoSnapshot.js";
import type { PetStats } from "../../src/domain/value-objects/PetStats.js";
import { generateStatusLine } from "../../src/domain/services/generateStatusLine.js";

const snapshot: RepoSnapshot = {
  owner: "acme",
  repo: "repopet",
  generatedAt: "2026-03-17T00:00:00.000Z",
  defaultBranch: "main",
  commitsLast7d: 6,
  commitsLast30d: 20,
  mergedPrsLast30d: 4,
  openIssues: 10,
  issuesOpenedLast30d: 4,
  issuesClosedLast30d: 5,
  latestWorkflowConclusion: "success",
  workflowSuccessRate30d: 92,
  daysSinceLastCommit: 1,
  streakDays: 5,
  bugfixKeywordCount30d: 2
};

const stats: PetStats = {
  health: 88,
  mood: 81,
  growth: 60,
  chaos: 12
};

describe("generateStatusLine", () => {
  it("is deterministic for the same state", () => {
    const first = generateStatusLine(
      { expression: "proud", stage: "teen", level: 6, stats, snapshot },
      scoringRules
    );
    const second = generateStatusLine(
      { expression: "proud", stage: "teen", level: 6, stats, snapshot },
      scoringRules
    );

    expect(first).toBe(second);
  });

  it("selects templates by expression bucket", () => {
    const line = generateStatusLine(
      { expression: "sick", stage: "baby", level: 2, stats: { ...stats, health: 15 }, snapshot },
      scoringRules
    );

    expect(scoringRules.statusLineTemplates.sick).toContain(line);
  });
});
