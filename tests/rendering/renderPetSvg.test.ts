import { describe, expect, it } from "vitest";
import { renderPetSvg } from "../../src/infrastructure/rendering/renderPetSvg.js";
import type { PetState } from "../../src/domain/entities/PetState.js";

const makeState = (overrides: Partial<PetState> = {}): PetState => ({
  snapshot: {
    owner: "acme",
    repo: "repopet",
    generatedAt: "2026-03-17T00:00:00.000Z",
    defaultBranch: "main",
    commitsLast7d: 7,
    commitsLast30d: 30,
    mergedPrsLast30d: 5,
    openIssues: 6,
    issuesOpenedLast30d: 5,
    issuesClosedLast30d: 7,
    latestWorkflowConclusion: "success",
    workflowSuccessRate30d: 92,
    daysSinceLastCommit: 0,
    streakDays: 8,
    bugfixKeywordCount30d: 1
  },
  stats: {
    health: 90,
    mood: 84,
    growth: 62,
    chaos: 20
  },
  stage: "teen",
  expression: "happy",
  level: 7,
  title: "Adept Merge Sprite",
  statusLine: "Steady commits keep my pixels sparkling.",
  lastUpdated: "2026-03-17T00:00:00.000Z",
  ...overrides
});

describe("renderPetSvg", () => {
  it("renders a valid svg document", () => {
    const svg = renderPetSvg(makeState());

    expect(svg).toContain("<svg");
    expect(svg).toContain("RepoPet");
    expect(svg).toContain("Stage: teen");
    expect(svg).toContain("Steady commits keep my pixels sparkling.");
  });

  it("changes visuals for stage and expression", () => {
    const proud = renderPetSvg(makeState({ stage: "final", expression: "proud" }));
    const sick = renderPetSvg(makeState({ stage: "baby", expression: "sick" }));

    expect(proud).not.toBe(sick);
    expect(proud).toContain("Expression: proud");
    expect(sick).toContain("Expression: sick");
  });
});
