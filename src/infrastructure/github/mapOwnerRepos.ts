import type { ZooRepository } from "../../domain/zoo/entities/ZooRepository.js";
import type { GitHubOwnerRepositoryRaw } from "../../types/github.js";

export const mapOwnerRepos = (repositories: GitHubOwnerRepositoryRaw[]): ZooRepository[] => {
  return repositories.map((repository) => ({
    owner: repository.owner.login,
    name: repository.name,
    fullName: repository.full_name,
    description: repository.description ?? "",
    language: repository.language,
    defaultBranch: repository.default_branch,
    visibility: repository.private ? "private" : "public",
    isFork: repository.fork,
    isArchived: repository.archived,
    updatedAt: repository.updated_at,
    pushedAt: repository.pushed_at
  }));
};
