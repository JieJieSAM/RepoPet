import type { ZooRepository } from "../entities/ZooRepository.js";
import type { ZooSelectionOptions } from "../value-objects/ZooSelectionOptions.js";

const compareIsoDesc = (leftIso: string, rightIso: string): number => {
  return rightIso.localeCompare(leftIso);
};

const compareNameAsc = (left: ZooRepository, right: ZooRepository): number => {
  return left.name.localeCompare(right.name);
};

const sortRepositories = (repositories: ZooRepository[], sortBy: ZooSelectionOptions["sortBy"]): ZooRepository[] => {
  const sorted = [...repositories];

  sorted.sort((left, right) => {
    if (sortBy === "name") {
      return compareNameAsc(left, right);
    }

    const primary =
      sortBy === "updated"
        ? compareIsoDesc(left.updatedAt, right.updatedAt)
        : compareIsoDesc(left.pushedAt, right.pushedAt);

    if (primary !== 0) {
      return primary;
    }

    return compareNameAsc(left, right);
  });

  return sorted;
};

export const selectRepositoriesForZoo = (
  repositories: ZooRepository[],
  options: ZooSelectionOptions
): ZooRepository[] => {
  const filtered = repositories.filter((repository) => {
    if (!options.includeForks && repository.isFork) {
      return false;
    }

    if (!options.includeArchived && repository.isArchived) {
      return false;
    }

    if (options.visibility !== "all" && repository.visibility !== options.visibility) {
      return false;
    }

    return true;
  });

  const sorted = sortRepositories(filtered, options.sortBy);
  return sorted.slice(0, options.maxRepos);
};
