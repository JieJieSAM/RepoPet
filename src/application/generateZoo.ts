import { resolve } from "node:path";
import type { RepoSnapshot } from "../domain/entities/RepoSnapshot.js";
import { scoringRules } from "../domain/config/scoringRules.js";
import { determinePetExpression } from "../domain/services/determinePetExpression.js";
import { determinePetStage } from "../domain/services/determinePetStage.js";
import { derivePetLevel } from "../domain/services/derivePetLevel.js";
import { generateStatusLine } from "../domain/services/generateStatusLine.js";
import { scoreRepoSnapshot } from "../domain/services/scoreRepoSnapshot.js";
import { zooRules } from "../domain/zoo/config/zooRules.js";
import type { AccountSummary } from "../domain/zoo/entities/AccountSummary.js";
import type { ZooRepositoryPet } from "../domain/zoo/entities/ZooRepositoryPet.js";
import type { ZooRepository } from "../domain/zoo/entities/ZooRepository.js";
import { buildAccountSummary } from "../domain/zoo/services/buildAccountSummary.js";
import { loadZooConfig, type LoadedZooConfig, type LoadZooConfigOptions } from "../infrastructure/config/loadZooConfig.js";
import { GitHubActivityClient } from "../infrastructure/github/GitHubActivityClient.js";
import { GitHubOwnerClient } from "../infrastructure/github/GitHubOwnerClient.js";
import { mapGitHubDataToSnapshot } from "../infrastructure/github/mapGitHubDataToSnapshot.js";
import { renderZooDashboardSvg } from "../infrastructure/rendering/renderZooDashboardSvg.js";
import { writeAccountSummary } from "../infrastructure/storage/writeAccountSummary.js";
import { writeZooDashboardSvg } from "../infrastructure/storage/writeZooDashboardSvg.js";

interface LoggerLike {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface GenerateZooResult {
  dryRun: boolean;
  summary: AccountSummary;
  svg: string;
  outputChanges: {
    summaryJsonChanged: boolean;
    dashboardSvgChanged: boolean;
  };
}

export interface GenerateZooDependencies {
  logger?: LoggerLike;
  now?: () => string;
  loadZooConfig?: (options: LoadZooConfigOptions) => LoadedZooConfig;
  fetchRepositoryPets?: (
    generatedAt: string,
    config: LoadedZooConfig,
    logger: LoggerLike
  ) => Promise<ZooRepositoryPet[]>;
  renderZooDashboardSvg?: (summary: AccountSummary) => string;
  writeAccountSummary?: typeof writeAccountSummary;
  writeZooDashboardSvg?: typeof writeZooDashboardSvg;
}

const defaultLogger: LoggerLike = {
  info: (message: string) => {
    console.log(message);
  },
  warn: (message: string) => {
    console.warn(message);
  },
  error: (message: string) => {
    console.error(message);
  }
};

const defaultNow = (): string => new Date().toISOString();

const buildRepositoryPet = (
  generatedAt: string,
  repository: ZooRepository,
  snapshot: RepoSnapshot
): ZooRepositoryPet => {
  const stats = scoreRepoSnapshot(snapshot, scoringRules);
  const stage = determinePetStage(stats.growth, scoringRules);
  const expression = determinePetExpression(stats, scoringRules);
  const level = derivePetLevel(stats);
  const statusLine = generateStatusLine(
    {
      expression,
      stage,
      level,
      stats,
      snapshot
    },
    scoringRules
  );

  return {
    repository,
    snapshot: {
      ...snapshot,
      generatedAt
    },
    stats,
    stage,
    expression,
    statusLine
  };
};

const defaultFetchRepositoryPets = async (
  generatedAt: string,
  config: LoadedZooConfig,
  logger: LoggerLike
): Promise<ZooRepositoryPet[]> => {
  const ownerClient = new GitHubOwnerClient({
    token: config.github.token,
    owner: config.github.owner,
    logger
  });
  const repositories = await ownerClient.fetchRepositories(config.selection);

  logger.info(`Selected repositories for zoo mode: ${repositories.length}`);
  const repositoryPets: ZooRepositoryPet[] = [];

  for (const repository of repositories) {
    try {
      const activityClient = new GitHubActivityClient({
        token: config.github.token,
        owner: repository.owner,
        repo: repository.name,
        rules: scoringRules,
        logger
      });

      const rawActivity = await activityClient.fetchActivitySnapshot(generatedAt);
      const snapshot = mapGitHubDataToSnapshot(rawActivity, scoringRules);
      repositoryPets.push(buildRepositoryPet(generatedAt, repository, snapshot));
    } catch (error: unknown) {
      logger.warn(
        `Skipping repository '${repository.fullName}' due to fetch/scoring error: ${(error as Error).message}`
      );
    }
  }

  return repositoryPets;
};

const resolveOutputPaths = (cwd: string): { summaryJson: string; dashboardSvg: string } => ({
  summaryJson: resolve(cwd, zooRules.outputPaths.summaryJson),
  dashboardSvg: resolve(cwd, zooRules.outputPaths.dashboardSvg)
});

export const generateZoo = async (
  options: LoadZooConfigOptions = {},
  dependencies: GenerateZooDependencies = {}
): Promise<GenerateZooResult> => {
  const logger = dependencies.logger ?? defaultLogger;
  const loadZooConfigFn = dependencies.loadZooConfig ?? loadZooConfig;
  const now = dependencies.now ?? defaultNow;
  const fetchRepositoryPetsFn = dependencies.fetchRepositoryPets ?? defaultFetchRepositoryPets;
  const renderZooDashboardSvgFn = dependencies.renderZooDashboardSvg ?? renderZooDashboardSvg;
  const writeAccountSummaryFn = dependencies.writeAccountSummary ?? writeAccountSummary;
  const writeZooDashboardSvgFn = dependencies.writeZooDashboardSvg ?? writeZooDashboardSvg;

  const config = loadZooConfigFn(options);
  const generatedAt = now();
  const outputPaths = resolveOutputPaths(process.cwd());

  logger.info(`Starting zoo generation for owner '${config.github.owner}'...`);
  const repositoryPets = await fetchRepositoryPetsFn(generatedAt, config, logger);
  const summary = buildAccountSummary({
    owner: config.github.owner,
    generatedAt,
    repositoryPets
  });
  const dashboardSvg = renderZooDashboardSvgFn(summary);

  logger.info(
    `Zoo summary: repos=${summary.totalReposScanned}, active=${summary.metrics.activeReposCount}, persona=${summary.persona.personaType}`
  );

  if (config.dryRun) {
    logger.info("Dry run enabled: skipping zoo file writes.");
    return {
      dryRun: true,
      summary,
      svg: dashboardSvg,
      outputChanges: {
        summaryJsonChanged: false,
        dashboardSvgChanged: false
      }
    };
  }

  const summaryWriteResult = await writeAccountSummaryFn(outputPaths.summaryJson, summary);
  const dashboardWriteResult = await writeZooDashboardSvgFn(outputPaths.dashboardSvg, dashboardSvg);

  logger.info(
    `Zoo files written: summary=${summaryWriteResult.changed ? "changed" : "unchanged"}, dashboard=${dashboardWriteResult.changed ? "changed" : "unchanged"}`
  );

  return {
    dryRun: false,
    summary,
    svg: dashboardSvg,
    outputChanges: {
      summaryJsonChanged: summaryWriteResult.changed,
      dashboardSvgChanged: dashboardWriteResult.changed
    }
  };
};
