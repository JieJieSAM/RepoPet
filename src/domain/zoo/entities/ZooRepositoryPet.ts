import type { RepoSnapshot } from "../../entities/RepoSnapshot.js";
import type { PetStats } from "../../value-objects/PetStats.js";
import type { PetStage } from "../../value-objects/PetStage.js";
import type { PetExpression } from "../../value-objects/PetExpression.js";
import type { ZooRepository } from "./ZooRepository.js";

export interface ZooRepositoryPet {
  repository: ZooRepository;
  snapshot: RepoSnapshot;
  stats: PetStats;
  stage: PetStage;
  expression: PetExpression;
  statusLine: string;
}
