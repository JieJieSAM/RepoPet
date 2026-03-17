import { describe, expect, it } from "vitest";
import { buildAccountSummary } from "../../../src/domain/zoo/services/buildAccountSummary.js";
import { zooRepositoryPetsFixture } from "../../fixtures/zoo/repositoryPets.js";

describe("buildAccountSummary", () => {
  it("builds deterministic account summary with rankings and persona", () => {
    const summary = buildAccountSummary({
      owner: "acme",
      generatedAt: "2026-03-17T00:00:00.000Z",
      repositoryPets: zooRepositoryPetsFixture
    });

    expect(summary.owner).toBe("acme");
    expect(summary.totalReposScanned).toBe(5);
    expect(summary.rankings.mostActive?.name).toBe("core-engine");
    expect(summary.persona.personaType).toBe("split_brain_zookeeper");
    expect(summary.repositories[0]?.styleTag).toBe("卷王型");
  });
});
