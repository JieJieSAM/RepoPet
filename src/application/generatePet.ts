import type { PetState } from "../domain/entities/PetState.js";
import type { ScoringRules } from "../domain/config/scoringRules.js";
import { determinePetExpression } from "../domain/services/determinePetExpression.js";
import { determinePetStage } from "../domain/services/determinePetStage.js";
import { derivePetLevel } from "../domain/services/derivePetLevel.js";
import { derivePetTitle } from "../domain/services/derivePetTitle.js";
import { generateStatusLine } from "../domain/services/generateStatusLine.js";
import { scoreRepoSnapshot } from "../domain/services/scoreRepoSnapshot.js";
import { loadConfig, type LoadConfigOptions, type LoadedConfig } from "../infrastructure/config/loadConfig.js";
import { GitHubActivityClient } from "../infrastructure/github/GitHubActivityClient.js";
import { mapGitHubDataToSnapshot } from "../infrastructure/github/mapGitHubDataToSnapshot.js";
import { renderPetSvg } from "../infrastructure/rendering/renderPetSvg.js";
import { updateReadmeBlock } from "../infrastructure/storage/updateReadmeBlock.js";
import { writeJson } from "../infrastructure/storage/writeJson.js";
import { writeSvg } from "../infrastructure/storage/writeSvg.js";
import type { GitHubActivityRawData } from "../types/github.js";

interface LoggerLike {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export interface GeneratePetResult {
  dryRun: boolean;
  state: PetState;
  svg: string;
  outputChanges: {
    jsonChanged: boolean;
    svgChanged: boolean;
    readmeChanged: boolean;
  };
}

export interface GeneratePetDependencies {
  logger?: LoggerLike;
  now?: () => string;
  loadConfig?: (options: LoadConfigOptions) => LoadedConfig;
  fetchActivitySnapshot?: (generatedAt: string, config: LoadedConfig, logger: LoggerLike) => Promise<GitHubActivityRawData>;
  renderPetSvg?: (state: PetState) => string;
  writeJson?: typeof writeJson;
  writeSvg?: typeof writeSvg;
  updateReadmeBlock?: typeof updateReadmeBlock;
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

const defaultFetchActivitySnapshot = async (
  generatedAt: string,
  config: LoadedConfig,
  logger: LoggerLike
): Promise<GitHubActivityRawData> => {
  const client = new GitHubActivityClient({
    token: config.github.token,
    owner: config.github.owner,
    repo: config.github.repo,
    rules: config.rules,
    logger
  });
  return client.fetchActivitySnapshot(generatedAt);
};

const buildPetState = (generatedAt: string, snapshot: ReturnType<typeof mapGitHubDataToSnapshot>, rules: ScoringRules): PetState => {
  const stats = scoreRepoSnapshot(snapshot, rules);
  const stage = determinePetStage(stats.growth, rules);
  const expression = determinePetExpression(stats, rules);
  const level = derivePetLevel(stats);
  const title = derivePetTitle(stage, level);
  const statusLine = generateStatusLine(
    {
      expression,
      stage,
      level,
      stats,
      snapshot
    },
    rules
  );

  return {
    snapshot,
    stats,
    stage,
    expression,
    level,
    title,
    statusLine,
    lastUpdated: generatedAt
  };
};

export const generatePet = async (
  options: LoadConfigOptions = {},
  dependencies: GeneratePetDependencies = {}
): Promise<GeneratePetResult> => {
  const logger = dependencies.logger ?? defaultLogger;
  const loadConfigFn = dependencies.loadConfig ?? loadConfig;
  const now: () => string = dependencies.now ?? defaultNow;
  const fetchActivitySnapshotFn = dependencies.fetchActivitySnapshot ?? defaultFetchActivitySnapshot;
  const renderPetSvgFn = dependencies.renderPetSvg ?? renderPetSvg;
  const writeJsonFn = dependencies.writeJson ?? writeJson;
  const writeSvgFn = dependencies.writeSvg ?? writeSvg;
  const updateReadmeBlockFn = dependencies.updateReadmeBlock ?? updateReadmeBlock;

  const config = loadConfigFn(options);
  const generatedAt = now();

  logger.info("Starting repository snapshot fetch...");
  const rawData = await fetchActivitySnapshotFn(generatedAt, config, logger);
  const snapshot = mapGitHubDataToSnapshot(rawData, config.rules);

  logger.info(
    `Fetched metrics: commits7d=${snapshot.commitsLast7d}, commits30d=${snapshot.commitsLast30d}, mergedPrs30d=${snapshot.mergedPrsLast30d}, openIssues=${snapshot.openIssues}`
  );

  const state = buildPetState(generatedAt, snapshot, config.rules);
  logger.info(
    `Scoring summary: health=${state.stats.health}, mood=${state.stats.mood}, growth=${state.stats.growth}, chaos=${state.stats.chaos}`
  );

  const svg = renderPetSvgFn(state);
  if (config.dryRun) {
    logger.info("Dry run enabled: skipping file writes.");
    return {
      dryRun: true,
      state,
      svg,
      outputChanges: {
        jsonChanged: false,
        svgChanged: false,
        readmeChanged: false
      }
    };
  }

  const jsonWriteResult = await writeJsonFn(config.outputPaths.json, state);
  const svgWriteResult = await writeSvgFn(config.outputPaths.svg, svg);
  const readmeWriteResult = await updateReadmeBlockFn(config.outputPaths.readme, config.rules.readmeBlock);

  logger.info(
    `Files written: json=${jsonWriteResult.changed ? "changed" : "unchanged"}, svg=${svgWriteResult.changed ? "changed" : "unchanged"}, readme=${readmeWriteResult.changed ? "changed" : "unchanged"}`
  );

  return {
    dryRun: false,
    state,
    svg,
    outputChanges: {
      jsonChanged: jsonWriteResult.changed,
      svgChanged: svgWriteResult.changed,
      readmeChanged: readmeWriteResult.changed
    }
  };
};
