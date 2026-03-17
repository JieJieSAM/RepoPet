import { resolve } from "node:path";
import { scoringRules, type ScoringRules } from "../../domain/config/scoringRules.js";

export interface LoadedConfig {
  github: {
    token: string;
    owner: string;
    repo: string;
  };
  dryRun: boolean;
  rules: ScoringRules;
  outputPaths: {
    json: string;
    svg: string;
    readme: string;
  };
}

export interface LoadConfigOptions {
  dryRunFlag?: boolean;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

const parseRepository = (repository: string): { owner: string; repo: string } => {
  const [owner, repo] = repository.split("/");
  if (!owner || !repo) {
    throw new Error("GITHUB_REPOSITORY must be formatted as owner/repo.");
  }
  return { owner, repo };
};

const parseBoolean = (value: string | undefined): boolean => {
  if (!value) {
    return false;
  }
  return value === "1" || value.toLowerCase() === "true";
};

export const loadConfig = (options: LoadConfigOptions = {}): LoadedConfig => {
  const env = options.env ?? process.env;
  const cwd = options.cwd ?? process.cwd();
  const token = env.GITHUB_TOKEN;
  const repository = env.GITHUB_REPOSITORY;

  if (token === undefined) {
    throw new Error("Missing required environment variable: GITHUB_TOKEN");
  }

  if (!repository) {
    throw new Error("Missing required environment variable: GITHUB_REPOSITORY (owner/repo)");
  }

  const { owner, repo } = parseRepository(repository);
  const dryRun = options.dryRunFlag ?? parseBoolean(env.REPOPET_DRY_RUN);

  return {
    github: {
      token,
      owner,
      repo
    },
    dryRun,
    rules: scoringRules,
    outputPaths: {
      json: resolve(cwd, scoringRules.outputPaths.json),
      svg: resolve(cwd, scoringRules.outputPaths.svg),
      readme: resolve(cwd, scoringRules.outputPaths.readme)
    }
  };
};
