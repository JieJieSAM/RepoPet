import { describe, expect, it } from "vitest";
import { scoringRules } from "../../src/domain/config/scoringRules.js";
import { determinePetStage } from "../../src/domain/services/determinePetStage.js";

describe("determinePetStage", () => {
  it("returns egg below baby threshold", () => {
    expect(determinePetStage(19, scoringRules)).toBe("egg");
  });

  it("returns baby between baby and teen thresholds", () => {
    expect(determinePetStage(20, scoringRules)).toBe("baby");
    expect(determinePetStage(44, scoringRules)).toBe("baby");
  });

  it("returns teen between teen and final thresholds", () => {
    expect(determinePetStage(45, scoringRules)).toBe("teen");
    expect(determinePetStage(74, scoringRules)).toBe("teen");
  });

  it("returns final at or above final threshold", () => {
    expect(determinePetStage(75, scoringRules)).toBe("final");
    expect(determinePetStage(99, scoringRules)).toBe("final");
  });
});
