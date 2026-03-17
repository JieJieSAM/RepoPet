import type { PetStats } from "../../value-objects/PetStats.js";
import type { ZooRepositoryPet } from "../entities/ZooRepositoryPet.js";
import type { AccountRepositorySummary, AccountAggregateMetrics } from "../entities/AccountSummary.js";
import { REPOSITORY_STYLE_TAGS, type RepositoryStyleTag } from "../value-objects/RepositoryStyleTag.js";
import { classifyRepositoryStyle } from "./classifyRepositoryStyle.js";

export interface RepositorySummaryResult {
  repositories: AccountRepositorySummary[];
  metrics: AccountAggregateMetrics;
  styleDistribution: Record<RepositoryStyleTag, number>;
}

const round2 = (value: number): number => Number(value.toFixed(2));

const getStyleDistributionSeed = (): Record<RepositoryStyleTag, number> => {
  return REPOSITORY_STYLE_TAGS.reduce<Record<RepositoryStyleTag, number>>((accumulator, styleTag) => {
    accumulator[styleTag] = 0;
    return accumulator;
  }, {} as Record<RepositoryStyleTag, number>);
};

const isActiveRepository = (repositoryPet: ZooRepositoryPet): boolean => {
  return repositoryPet.snapshot.daysSinceLastCommit <= 7 || repositoryPet.snapshot.commitsLast30d >= 5;
};

const isDormantRepository = (repositoryPet: ZooRepositoryPet): boolean => {
  return repositoryPet.snapshot.daysSinceLastCommit > 21 || repositoryPet.snapshot.commitsLast30d === 0;
};

const calcAverageStats = (repositoryPets: ZooRepositoryPet[]): PetStats => {
  if (repositoryPets.length === 0) {
    return {
      health: 0,
      mood: 0,
      growth: 0,
      chaos: 0
    };
  }

  const totals = repositoryPets.reduce(
    (accumulator, repositoryPet) => ({
      health: accumulator.health + repositoryPet.stats.health,
      mood: accumulator.mood + repositoryPet.stats.mood,
      growth: accumulator.growth + repositoryPet.stats.growth,
      chaos: accumulator.chaos + repositoryPet.stats.chaos
    }),
    { health: 0, mood: 0, growth: 0, chaos: 0 }
  );

  return {
    health: round2(totals.health / repositoryPets.length),
    mood: round2(totals.mood / repositoryPets.length),
    growth: round2(totals.growth / repositoryPets.length),
    chaos: round2(totals.chaos / repositoryPets.length)
  };
};

const calcActivitySpread = (repositoryPets: ZooRepositoryPet[]): number => {
  if (repositoryPets.length === 0) {
    return 0;
  }

  const commits = repositoryPets.map((repositoryPet) => repositoryPet.snapshot.commitsLast30d);
  const mean = commits.reduce((sum, value) => sum + value, 0) / commits.length;
  const variance = commits.reduce((sum, value) => sum + (value - mean) ** 2, 0) / commits.length;
  return round2(Math.sqrt(variance));
};

const calcBugfixCommitRatio = (repositoryPets: ZooRepositoryPet[]): number => {
  const totalCommits = repositoryPets.reduce((sum, repositoryPet) => sum + repositoryPet.snapshot.commitsLast30d, 0);
  if (totalCommits === 0) {
    return 0;
  }

  const totalBugfixCommits = repositoryPets.reduce(
    (sum, repositoryPet) => sum + repositoryPet.snapshot.bugfixKeywordCount30d,
    0
  );
  return round2(totalBugfixCommits / totalCommits);
};

const calcWorkflowStability = (repositoryPets: ZooRepositoryPet[]): number => {
  if (repositoryPets.length === 0) {
    return 0;
  }

  const total = repositoryPets.reduce((sum, repositoryPet) => sum + repositoryPet.snapshot.workflowSuccessRate30d, 0);
  return round2(total / repositoryPets.length);
};

const calcRecentActivityConcentration = (repositoryPets: ZooRepositoryPet[]): number => {
  const totalCommits = repositoryPets.reduce((sum, repositoryPet) => sum + repositoryPet.snapshot.commitsLast30d, 0);
  if (totalCommits === 0) {
    return 0;
  }

  const highestCommitCount = repositoryPets.reduce(
    (highest, repositoryPet) => Math.max(highest, repositoryPet.snapshot.commitsLast30d),
    0
  );

  return round2(highestCommitCount / totalCommits);
};

export const summarizeRepositories = (repositoryPets: ZooRepositoryPet[]): RepositorySummaryResult => {
  const styleDistribution = getStyleDistributionSeed();

  const repositories: AccountRepositorySummary[] = repositoryPets.map((repositoryPet) => {
    const styleTag = classifyRepositoryStyle(repositoryPet);
    styleDistribution[styleTag] += 1;

    return {
      name: repositoryPet.repository.name,
      fullName: repositoryPet.repository.fullName,
      styleTag,
      stats: repositoryPet.stats,
      stage: repositoryPet.stage,
      expression: repositoryPet.expression,
      statusLine: repositoryPet.statusLine,
      commitsLast30d: repositoryPet.snapshot.commitsLast30d,
      daysSinceLastCommit: repositoryPet.snapshot.daysSinceLastCommit,
      workflowSuccessRate30d: repositoryPet.snapshot.workflowSuccessRate30d
    };
  });

  const activeReposCount = repositoryPets.filter(isActiveRepository).length;
  const dormantReposCount = repositoryPets.filter(isDormantRepository).length;

  return {
    repositories,
    styleDistribution,
    metrics: {
      averageStats: calcAverageStats(repositoryPets),
      activeReposCount,
      dormantReposCount,
      activitySpread: calcActivitySpread(repositoryPets),
      bugfixCommitRatio: calcBugfixCommitRatio(repositoryPets),
      workflowStability: calcWorkflowStability(repositoryPets),
      recentActivityConcentration: calcRecentActivityConcentration(repositoryPets)
    }
  };
};
