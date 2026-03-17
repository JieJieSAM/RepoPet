import type { RepositoryRankings, RankedRepository } from "../entities/AccountSummary.js";
import type { ZooRepositoryPet } from "../entities/ZooRepositoryPet.js";

const round2 = (value: number): number => Number(value.toFixed(2));

const pickTopRepository = (
  repositoryPets: ZooRepositoryPet[],
  score: (repositoryPet: ZooRepositoryPet) => number
): RankedRepository | null => {
  if (repositoryPets.length === 0) {
    return null;
  }

  const sorted = [...repositoryPets].sort((left, right) => {
    const delta = score(right) - score(left);
    if (delta !== 0) {
      return delta;
    }
    return left.repository.name.localeCompare(right.repository.name);
  });

  const winner = sorted[0];
  return {
    name: winner.repository.name,
    fullName: winner.repository.fullName,
    score: round2(score(winner))
  };
};

export const rankRepositories = (repositoryPets: ZooRepositoryPet[]): RepositoryRankings => {
  return {
    mostActive: pickTopRepository(
      repositoryPets,
      (repositoryPet) =>
        repositoryPet.snapshot.commitsLast30d +
        repositoryPet.snapshot.commitsLast7d * 0.45 +
        repositoryPet.snapshot.streakDays * 0.3
    ),
    healthiest: pickTopRepository(
      repositoryPets,
      (repositoryPet) =>
        repositoryPet.stats.health +
        repositoryPet.snapshot.workflowSuccessRate30d * 0.1 -
        repositoryPet.stats.chaos * 0.2
    ),
    mostChaotic: pickTopRepository(
      repositoryPets,
      (repositoryPet) =>
        repositoryPet.stats.chaos +
        repositoryPet.snapshot.bugfixKeywordCount30d * 1.2 +
        (repositoryPet.snapshot.latestWorkflowConclusion === "failure" ? 8 : 0)
    ),
    sleepiest: pickTopRepository(
      repositoryPets,
      (repositoryPet) =>
        (100 - repositoryPet.stats.mood) +
        repositoryPet.snapshot.daysSinceLastCommit * 1.4 +
        (repositoryPet.snapshot.commitsLast7d === 0 ? 6 : 0)
    ),
    highestGrowth: pickTopRepository(
      repositoryPets,
      (repositoryPet) => repositoryPet.stats.growth + repositoryPet.snapshot.commitsLast30d * 0.5
    )
  };
};
