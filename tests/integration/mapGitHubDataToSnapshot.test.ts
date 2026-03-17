import { describe, expect, it } from "vitest";
import { scoringRules } from "../../src/domain/config/scoringRules.js";
import { mapGitHubDataToSnapshot } from "../../src/infrastructure/github/mapGitHubDataToSnapshot.js";
import { rawActivityFixture } from "../fixtures/github/rawActivity.js";

describe("mapGitHubDataToSnapshot", () => {
  it("maps GitHub raw activity into a deterministic RepoSnapshot", () => {
    const snapshot = mapGitHubDataToSnapshot(rawActivityFixture, scoringRules);

    expect(snapshot.owner).toBe("acme");
    expect(snapshot.repo).toBe("repopet");
    expect(snapshot.defaultBranch).toBe("main");
    expect(snapshot.commitsLast7d).toBe(3);
    expect(snapshot.commitsLast30d).toBe(5);
    expect(snapshot.mergedPrsLast30d).toBe(2);
    expect(snapshot.openIssues).toBe(9);
    expect(snapshot.issuesOpenedLast30d).toBe(2);
    expect(snapshot.issuesClosedLast30d).toBe(1);
    expect(snapshot.latestWorkflowConclusion).toBe("success");
    expect(snapshot.workflowSuccessRate30d).toBeCloseTo(66.67, 2);
    expect(snapshot.daysSinceLastCommit).toBe(0);
    expect(snapshot.streakDays).toBe(2);
    expect(snapshot.bugfixKeywordCount30d).toBe(2);
  });
});
