import type { PetStats } from "../value-objects/PetStats.js";
import type { ScoringRules } from "../config/scoringRules.js";
import type { PetExpression } from "../value-objects/PetExpression.js";

export const determinePetExpression = (stats: PetStats, rules: ScoringRules): PetExpression => {
  const thresholds = rules.expressionThresholds;

  if (stats.health < thresholds.sickHealthMax) {
    return "sick";
  }

  if (stats.chaos > thresholds.chaoticChaosMin) {
    return "chaotic";
  }

  if (stats.mood < thresholds.sleepyMoodMax) {
    return "sleepy";
  }

  if (stats.mood > thresholds.proudMoodMin && stats.growth > thresholds.proudGrowthMin) {
    return "proud";
  }

  if (stats.mood > thresholds.happyMoodMin) {
    return "happy";
  }

  return "stressed";
};
