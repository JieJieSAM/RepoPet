import { describe, expect, it } from "vitest";
import { buildAccountSummary } from "../../src/domain/zoo/services/buildAccountSummary.js";
import { renderZooDashboardSvg } from "../../src/infrastructure/rendering/renderZooDashboardSvg.js";
import { zooRepositoryPetsFixture } from "../fixtures/zoo/repositoryPets.js";

describe("renderZooDashboardSvg", () => {
  it("renders persona header, repository cards, and highlights", () => {
    const summary = buildAccountSummary({
      owner: "acme",
      generatedAt: "2026-03-17T00:00:00.000Z",
      repositoryPets: zooRepositoryPetsFixture
    });

    const svg = renderZooDashboardSvg(summary);

    expect(svg).toContain("<svg");
    expect(svg).toContain("RepoPet Zoo");
    expect(svg).toContain(summary.persona.personaTitle);
    expect(svg).toContain("core-engine");
    expect(svg).toContain("Zoo Highlights");
    expect(svg).toContain("最混沌仓库");
  });
});
