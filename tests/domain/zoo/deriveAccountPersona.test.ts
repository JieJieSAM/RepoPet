import { describe, expect, it } from "vitest";
import { deriveAccountPersona } from "../../../src/domain/zoo/services/deriveAccountPersona.js";
import { summarizeRepositories } from "../../../src/domain/zoo/services/summarizeRepositories.js";
import { zooRepositoryPetsFixture } from "../../fixtures/zoo/repositoryPets.js";

describe("deriveAccountPersona", () => {
  it("derives split_brain_zookeeper persona for highly split activity", () => {
    const summary = summarizeRepositories(zooRepositoryPetsFixture);

    const persona = deriveAccountPersona({
      totalRepos: zooRepositoryPetsFixture.length,
      metrics: summary.metrics
    });

    expect(persona.personaType).toBe("split_brain_zookeeper");
    expect(persona.personaTitle).toBe("多线程人格分裂兽");
    expect(persona.personaMood).toBe("chaotic");
    expect(persona.personaSummary).toContain("活跃 3 / 冬眠 2");
    expect(persona.dominantTrait).toBe("健康度领先");
    expect(persona.warningTrait).toBe("冬眠仓库占比偏高");
  });

  it("derives hibernation_keeper when most repos are dormant", () => {
    const dormantHeavyRepos = zooRepositoryPetsFixture.filter(
      (repositoryPet) =>
        repositoryPet.repository.name === "docs-site" || repositoryPet.repository.name === "archive-tool"
    );
    const summary = summarizeRepositories(dormantHeavyRepos);

    const persona = deriveAccountPersona({
      totalRepos: dormantHeavyRepos.length,
      metrics: summary.metrics
    });

    expect(persona.personaType).toBe("hibernation_keeper");
    expect(persona.personaTitle).toBe("仓库冬眠管理员");
    expect(persona.personaMood).toBe("sleepy");
  });
});
