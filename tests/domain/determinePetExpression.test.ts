import { describe, expect, it } from "vitest";
import { scoringRules } from "../../src/domain/config/scoringRules.js";
import { determinePetExpression } from "../../src/domain/services/determinePetExpression.js";
import type { PetStats } from "../../src/domain/value-objects/PetStats.js";

const stats = (overrides: Partial<PetStats>): PetStats => ({
  health: 60,
  mood: 60,
  growth: 60,
  chaos: 30,
  ...overrides
});

describe("determinePetExpression", () => {
  it("prioritizes sick when health is critical", () => {
    expect(determinePetExpression(stats({ health: 10, chaos: 95, mood: 99 }), scoringRules)).toBe("sick");
  });

  it("returns chaotic when chaos is very high", () => {
    expect(determinePetExpression(stats({ chaos: 90, mood: 80, health: 80 }), scoringRules)).toBe("chaotic");
  });

  it("returns sleepy when mood is low", () => {
    expect(determinePetExpression(stats({ mood: 10, health: 80, chaos: 20 }), scoringRules)).toBe("sleepy");
  });

  it("returns proud when mood and growth are high", () => {
    expect(determinePetExpression(stats({ mood: 90, growth: 80, health: 80 }), scoringRules)).toBe("proud");
  });

  it("returns happy when mood is good and proud criteria are not met", () => {
    expect(determinePetExpression(stats({ mood: 70, growth: 40, health: 80 }), scoringRules)).toBe("happy");
  });

  it("falls back to stressed", () => {
    expect(determinePetExpression(stats({ mood: 50, health: 70, chaos: 20 }), scoringRules)).toBe("stressed");
  });
});
