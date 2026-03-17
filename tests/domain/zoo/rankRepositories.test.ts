import { describe, expect, it } from "vitest";
import { rankRepositories } from "../../../src/domain/zoo/services/rankRepositories.js";
import { zooRepositoryPetsFixture } from "../../fixtures/zoo/repositoryPets.js";

describe("rankRepositories", () => {
  it("produces deterministic highlight rankings", () => {
    const rankings = rankRepositories(zooRepositoryPetsFixture);

    expect(rankings.mostActive?.name).toBe("core-engine");
    expect(rankings.healthiest?.name).toBe("core-engine");
    expect(rankings.mostChaotic?.name).toBe("legacy-api");
    expect(rankings.sleepiest?.name).toBe("archive-tool");
    expect(rankings.highestGrowth?.name).toBe("core-engine");
  });
});
