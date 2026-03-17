import type { PetExpression } from "../value-objects/PetExpression.js";
import type { PetStage } from "../value-objects/PetStage.js";
import type { PetStats } from "../value-objects/PetStats.js";
import type { RepoSnapshot } from "../entities/RepoSnapshot.js";
import type { ScoringRules } from "../config/scoringRules.js";

export interface StatusLineContext {
  expression: PetExpression;
  stage: PetStage;
  level: number;
  stats: PetStats;
  snapshot: RepoSnapshot;
}

const templateGroupForExpression = (
  expression: PetExpression
): "sick" | "chaotic" | "sleepy" | "proud" | "happy" | "stressed" => {
  if (expression === "sick") {
    return "sick";
  }

  if (expression === "chaotic") {
    return "chaotic";
  }

  if (expression === "sleepy") {
    return "sleepy";
  }

  if (expression === "proud") {
    return "proud";
  }

  if (expression === "happy") {
    return "happy";
  }

  return "stressed";
};

export const generateStatusLine = (context: StatusLineContext, rules: ScoringRules): string => {
  const group = templateGroupForExpression(context.expression);
  const templates = rules.statusLineTemplates[group];

  if (templates.length === 0) {
    return "Activity observed. Pet remains deterministic.";
  }

  const seed =
    context.level +
    context.stats.chaos +
    context.snapshot.commitsLast30d +
    context.snapshot.openIssues +
    context.stage.length;
  const index = Math.abs(seed) % templates.length;

  return templates[index];
};
