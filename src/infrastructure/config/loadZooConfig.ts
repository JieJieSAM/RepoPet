import type { ZooSelectionOptions, ZooSortBy, ZooVisibilityFilter } from "../../domain/zoo/value-objects/ZooSelectionOptions.js";

export interface LoadedZooConfig {
  github: {
    token: string;
    owner: string;
  };
  dryRun: boolean;
  selection: ZooSelectionOptions;
}

export interface LoadZooConfigOptions {
  dryRunFlag?: boolean;
  env?: NodeJS.ProcessEnv;
}

const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (!value) {
    return defaultValue;
  }

  return value === "1" || value.toLowerCase() === "true";
};

const parseMaxRepos = (value: string | undefined): number => {
  if (!value) {
    return 12;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("REPOPET_MAX_REPOS must be a positive integer.");
  }

  return Math.min(parsed, 50);
};

const parseSortBy = (value: string | undefined): ZooSortBy => {
  if (!value) {
    return "updated";
  }

  if (value === "updated" || value === "pushed" || value === "name") {
    return value;
  }

  throw new Error("REPOPET_SORT_BY must be one of: updated, pushed, name.");
};

const parseVisibility = (value: string | undefined): ZooVisibilityFilter => {
  if (!value) {
    return "all";
  }

  if (value === "all" || value === "public" || value === "private") {
    return value;
  }

  throw new Error("REPOPET_REPO_VISIBILITY must be one of: all, public, private.");
};

export const loadZooConfig = (options: LoadZooConfigOptions = {}): LoadedZooConfig => {
  const env = options.env ?? process.env;
  const token = env.GITHUB_TOKEN;
  const owner = env.GITHUB_OWNER;

  if (token === undefined) {
    throw new Error("Missing required environment variable: GITHUB_TOKEN");
  }

  if (!owner) {
    throw new Error("Missing required environment variable: GITHUB_OWNER");
  }

  return {
    github: {
      token,
      owner
    },
    dryRun: options.dryRunFlag ?? parseBoolean(env.REPOPET_DRY_RUN, false),
    selection: {
      includeForks: parseBoolean(env.REPOPET_INCLUDE_FORKS, false),
      includeArchived: parseBoolean(env.REPOPET_INCLUDE_ARCHIVED, false),
      maxRepos: parseMaxRepos(env.REPOPET_MAX_REPOS),
      sortBy: parseSortBy(env.REPOPET_SORT_BY),
      visibility: parseVisibility(env.REPOPET_REPO_VISIBILITY)
    }
  };
};
