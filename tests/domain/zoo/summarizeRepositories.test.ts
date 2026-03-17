import { describe, expect, it } from "vitest";
import { summarizeRepositories } from "../../../src/domain/zoo/services/summarizeRepositories.js";
import { zooRepositoryPetsFixture } from "../../fixtures/zoo/repositoryPets.js";

describe("summarizeRepositories", () => {
  it("aggregates account-level metrics and style distribution", () => {
    const summary = summarizeRepositories(zooRepositoryPetsFixture);

    expect(summary.repositories).toHaveLength(5);
    expect(summary.metrics.activeReposCount).toBe(3);
    expect(summary.metrics.dormantReposCount).toBe(2);
    expect(summary.metrics.averageStats.health).toBe(60.8);
    expect(summary.metrics.averageStats.mood).toBe(50);
    expect(summary.metrics.averageStats.growth).toBe(41.6);
    expect(summary.metrics.averageStats.chaos).toBe(40.8);
    expect(summary.metrics.activitySpread).toBe(14.78);
    expect(summary.metrics.bugfixCommitRatio).toBe(0.21);
    expect(summary.metrics.workflowStability).toBe(60.4);
    expect(summary.metrics.recentActivityConcentration).toBe(0.61);

    expect(summary.styleDistribution["卷王型"]).toBe(1);
    expect(summary.styleDistribution["修补型"]).toBe(2);
    expect(summary.styleDistribution["养老型"]).toBe(1);
    expect(summary.styleDistribution["冬眠型"]).toBe(1);
    expect(summary.styleDistribution["稳定型"]).toBe(0);
  });
});
