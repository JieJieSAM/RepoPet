import type { AccountSummary } from "../entities/AccountSummary.js";
import type { ZooRepositoryPet } from "../entities/ZooRepositoryPet.js";
import { deriveAccountPersona } from "./deriveAccountPersona.js";
import { rankRepositories } from "./rankRepositories.js";
import { summarizeRepositories } from "./summarizeRepositories.js";

export interface BuildAccountSummaryInput {
  owner: string;
  generatedAt: string;
  repositoryPets: ZooRepositoryPet[];
}

export const buildAccountSummary = (input: BuildAccountSummaryInput): AccountSummary => {
  const summary = summarizeRepositories(input.repositoryPets);
  const rankings = rankRepositories(input.repositoryPets);
  const persona = deriveAccountPersona({
    totalRepos: input.repositoryPets.length,
    metrics: summary.metrics
  });

  return {
    owner: input.owner,
    generatedAt: input.generatedAt,
    totalReposScanned: input.repositoryPets.length,
    metrics: summary.metrics,
    styleDistribution: summary.styleDistribution,
    rankings,
    persona,
    repositories: summary.repositories
  };
};
