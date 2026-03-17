import { personaTitleByType } from "../chineseLabels.js";
import type { PersonaProfile, PersonaType } from "../entities/PersonaProfile.js";
import type { AccountAggregateMetrics } from "../entities/AccountSummary.js";

export interface PersonaInput {
  totalRepos: number;
  metrics: AccountAggregateMetrics;
}

const dominantTrait = (metrics: AccountAggregateMetrics): string => {
  const entries: Array<{ label: string; value: number }> = [
    { label: "健康度", value: metrics.averageStats.health },
    { label: "情绪值", value: metrics.averageStats.mood },
    { label: "成长力", value: metrics.averageStats.growth }
  ];

  entries.sort((left, right) => right.value - left.value);
  return `${entries[0].label}领先`;
};

const warningTrait = (metrics: AccountAggregateMetrics, totalRepos: number): string => {
  const dormantRatio = totalRepos === 0 ? 0 : metrics.dormantReposCount / totalRepos;

  if (metrics.averageStats.chaos >= 65) {
    return "混沌值偏高";
  }

  if (metrics.workflowStability < 55) {
    return "CI 稳定性待提升";
  }

  if (dormantRatio >= 0.4) {
    return "冬眠仓库占比偏高";
  }

  return "节奏总体可控";
};

const derivePersonaType = (input: PersonaInput): PersonaType => {
  const { totalRepos, metrics } = input;
  const dormantRatio = totalRepos === 0 ? 0 : metrics.dormantReposCount / totalRepos;

  if (totalRepos === 0 || dormantRatio >= 0.75) {
    return "hibernation_keeper";
  }

  if (metrics.averageStats.chaos >= 68 || metrics.bugfixCommitRatio >= 0.33) {
    return "bugfix_hero";
  }

  if (
    metrics.activitySpread >= 12 &&
    metrics.recentActivityConcentration >= 0.45 &&
    metrics.activeReposCount >= 2 &&
    metrics.dormantReposCount >= 1
  ) {
    return "split_brain_zookeeper";
  }

  if (metrics.workflowStability >= 82 && metrics.averageStats.health >= 75 && metrics.averageStats.chaos <= 35) {
    return "order_keeper";
  }

  if (metrics.recentActivityConcentration >= 0.58 && metrics.averageStats.growth >= 35) {
    return "late_night_grinder";
  }

  return "order_keeper";
};

const summaryByPersona = (personaType: PersonaType, metrics: AccountAggregateMetrics): string => {
  if (personaType === "hibernation_keeper") {
    return `近期以保温为主，活跃仓库 ${metrics.activeReposCount} 个，建议唤醒核心项目。`;
  }

  if (personaType === "bugfix_hero") {
    return `修补节奏明显，混沌值 ${metrics.averageStats.chaos}，正在用热修守住阵地。`;
  }

  if (personaType === "split_brain_zookeeper") {
    return `仓库状态分化明显，活跃 ${metrics.activeReposCount} / 冬眠 ${metrics.dormantReposCount}，多线并进中。`;
  }

  if (personaType === "late_night_grinder") {
    return `火力集中在少数主力仓库，成长值 ${metrics.averageStats.growth}，爆肝推进中。`;
  }

  return `节奏稳健，健康值 ${metrics.averageStats.health}，CI 稳定性 ${metrics.workflowStability}。`;
};

const moodByPersona = (personaType: PersonaType): PersonaProfile["personaMood"] => {
  if (personaType === "hibernation_keeper") {
    return "sleepy";
  }

  if (personaType === "bugfix_hero") {
    return "stressed";
  }

  if (personaType === "split_brain_zookeeper") {
    return "chaotic";
  }

  if (personaType === "late_night_grinder") {
    return "proud";
  }

  return "happy";
};

export const deriveAccountPersona = (input: PersonaInput): PersonaProfile => {
  const personaType = derivePersonaType(input);
  const title = personaTitleByType[personaType];

  return {
    personaType,
    personaTitle: title,
    personaMood: moodByPersona(personaType),
    personaSummary: summaryByPersona(personaType, input.metrics),
    dominantTrait: dominantTrait(input.metrics),
    warningTrait: warningTrait(input.metrics, input.totalRepos)
  };
};
