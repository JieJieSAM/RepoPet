import type { ZooRepositoryPet } from "../entities/ZooRepositoryPet.js";
import type { RepositoryStyleTag } from "../value-objects/RepositoryStyleTag.js";

export const classifyRepositoryStyle = (repositoryPet: ZooRepositoryPet): RepositoryStyleTag => {
  const { snapshot, stats } = repositoryPet;

  if (snapshot.daysSinceLastCommit > 30 || snapshot.commitsLast30d === 0) {
    return "冬眠型";
  }

  const bugfixRatio = snapshot.commitsLast30d === 0 ? 0 : snapshot.bugfixKeywordCount30d / snapshot.commitsLast30d;
  if (stats.chaos >= 70 || bugfixRatio >= 0.35) {
    return "修补型";
  }

  if (stats.growth >= 70 && stats.mood >= 60 && snapshot.commitsLast30d >= 15) {
    return "卷王型";
  }

  if (stats.health >= 78 && stats.chaos <= 35 && snapshot.workflowSuccessRate30d >= 80) {
    return "稳定型";
  }

  return "养老型";
};
