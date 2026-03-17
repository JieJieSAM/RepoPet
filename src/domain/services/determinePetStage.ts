import type { ScoringRules } from "../config/scoringRules.js";
import type { PetStage } from "../value-objects/PetStage.js";

export const determinePetStage = (growth: number, rules: ScoringRules): PetStage => {
  if (growth < rules.stageThresholds.babyMinGrowth) {
    return "egg";
  }

  if (growth < rules.stageThresholds.teenMinGrowth) {
    return "baby";
  }

  if (growth < rules.stageThresholds.finalMinGrowth) {
    return "teen";
  }

  return "final";
};
