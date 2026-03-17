import type { RepoSnapshot } from "./RepoSnapshot.js";
import type { PetStats } from "../value-objects/PetStats.js";
import type { PetStage } from "../value-objects/PetStage.js";
import type { PetExpression } from "../value-objects/PetExpression.js";

export interface PetState {
  snapshot: RepoSnapshot;
  stats: PetStats;
  stage: PetStage;
  expression: PetExpression;
  level: number;
  title: string;
  statusLine: string;
  lastUpdated: string;
}
