import { describe, expect, it } from "vitest";
import { scoringRules } from "../../src/domain/config/scoringRules.js";
import type { RepoSnapshot } from "../../src/domain/entities/RepoSnapshot.js";
import { scoreChaos, scoreGrowth, scoreHealth, scoreMood, scoreRepoSnapshot } from "../../src/domain/services/scoreRepoSnapshot.js";

const makeSnapshot = (overrides: Partial<RepoSnapshot> = {}): RepoSnapshot => ({
  owner: "acme",
  repo: "repopet",
  generatedAt: "2026-03-17T00:00:00.000Z",
  defaultBranch: "main",
  commitsLast7d: 5,
  commitsLast30d: 22,
  mergedPrsLast30d: 4,
  openIssues: 12,
  issuesOpenedLast30d: 8,
  issuesClosedLast30d: 9,
  latestWorkflowConclusion: "success",
  workflowSuccessRate30d: 88,
  daysSinceLastCommit: 1,
  streakDays: 6,
  bugfixKeywordCount30d: 3,
  ...overrides
});

describe("scoreRepoSnapshot", () => {
  it("keeps all scores in the 0-100 range", () => {
    const noisy = makeSnapshot({
      commitsLast7d: 100,
      commitsLast30d: 500,
      mergedPrsLast30d: 50,
      openIssues: 200,
      issuesOpenedLast30d: 150,
      issuesClosedLast30d: 1,
      workflowSuccessRate30d: 0,
      latestWorkflowConclusion: "failure",
      daysSinceLastCommit: 100,
      streakDays: 0,
      bugfixKeywordCount30d: 100
    });

    const stats = scoreRepoSnapshot(noisy, scoringRules);

    expect(stats.health).toBeGreaterThanOrEqual(0);
    expect(stats.health).toBeLessThanOrEqual(100);
    expect(stats.mood).toBeGreaterThanOrEqual(0);
    expect(stats.mood).toBeLessThanOrEqual(100);
    expect(stats.growth).toBeGreaterThanOrEqual(0);
    expect(stats.growth).toBeLessThanOrEqual(100);
    expect(stats.chaos).toBeGreaterThanOrEqual(0);
    expect(stats.chaos).toBeLessThanOrEqual(100);
  });

  it("scores healthy repos higher than unstable repos for health and mood", () => {
    const healthy = makeSnapshot({
      workflowSuccessRate30d: 95,
      latestWorkflowConclusion: "success",
      daysSinceLastCommit: 0,
      streakDays: 10,
      openIssues: 4
    });

    const unstable = makeSnapshot({
      workflowSuccessRate30d: 20,
      latestWorkflowConclusion: "failure",
      daysSinceLastCommit: 12,
      streakDays: 0,
      openIssues: 50
    });

    expect(scoreHealth(healthy, scoringRules)).toBeGreaterThan(scoreHealth(unstable, scoringRules));
    expect(scoreMood(healthy, scoringRules)).toBeGreaterThan(scoreMood(unstable, scoringRules));
  });

  it("increases chaos for failures and bugfix-heavy periods", () => {
    const calm = makeSnapshot({
      latestWorkflowConclusion: "success",
      workflowSuccessRate30d: 95,
      bugfixKeywordCount30d: 0,
      issuesOpenedLast30d: 6,
      issuesClosedLast30d: 6
    });

    const chaotic = makeSnapshot({
      latestWorkflowConclusion: "failure",
      workflowSuccessRate30d: 45,
      bugfixKeywordCount30d: 10,
      issuesOpenedLast30d: 20,
      issuesClosedLast30d: 2,
      commitsLast7d: 12,
      commitsLast30d: 15
    });

    expect(scoreChaos(chaotic, scoringRules)).toBeGreaterThan(scoreChaos(calm, scoringRules));
  });

  it("gives growth credit to consistent, cumulative activity", () => {
    const steady = makeSnapshot({
      commitsLast30d: 30,
      mergedPrsLast30d: 8,
      streakDays: 15,
      commitsLast7d: 8
    });

    const bursty = makeSnapshot({
      commitsLast30d: 18,
      mergedPrsLast30d: 2,
      streakDays: 1,
      commitsLast7d: 16
    });

    expect(scoreGrowth(steady, scoringRules)).toBeGreaterThan(scoreGrowth(bursty, scoringRules));
  });
});
