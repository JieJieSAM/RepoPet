import type { RepoSnapshot } from "../entities/RepoSnapshot.js";
import type { ScoringRules } from "../config/scoringRules.js";
import type { PetStats } from "../value-objects/PetStats.js";

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
const round = (value: number): number => Math.round(value);

export const scoreHealth = (snapshot: RepoSnapshot, rules: ScoringRules): number => {
  const healthRules = rules.weights.health;
  let score = healthRules.base;

  score += snapshot.workflowSuccessRate30d * healthRules.workflowSuccessRateFactor;
  score += healthRules.latestConclusionImpact[snapshot.latestWorkflowConclusion];

  const openIssuePressure = Math.max(0, snapshot.openIssues - healthRules.openIssuesGrace);
  score -= Math.min(openIssuePressure * healthRules.openIssuePenaltyPerIssue, healthRules.maxIssuePenalty);

  const staleDays = Math.max(0, snapshot.daysSinceLastCommit - healthRules.freshnessGraceDays);
  score -= Math.min(staleDays * healthRules.stalePenaltyPerDay, healthRules.maxStalePenalty);

  const closureDelta = snapshot.issuesClosedLast30d - snapshot.issuesOpenedLast30d;
  const closureSwing = clamp(
    closureDelta * healthRules.issueClosureBonusFactor,
    -healthRules.maxClosureSwing,
    healthRules.maxClosureSwing
  );
  score += closureSwing;

  return clamp(round(score), 0, 100);
};

export const scoreMood = (snapshot: RepoSnapshot, rules: ScoringRules): number => {
  const moodRules = rules.weights.mood;
  let score = moodRules.base;

  score += Math.min(snapshot.streakDays * moodRules.streakFactor, moodRules.maxStreakBoost);
  score += Math.min(snapshot.commitsLast7d * moodRules.commitsLast7dFactor, moodRules.maxCommitsBoost);
  score += Math.min(snapshot.mergedPrsLast30d * moodRules.mergedPrFactor, moodRules.maxMergedPrBoost);

  const inactivityPenalty = Math.min(
    snapshot.daysSinceLastCommit * moodRules.inactivityPenaltyPerDay,
    moodRules.maxInactivityPenalty
  );
  score -= inactivityPenalty;

  return clamp(round(score), 0, 100);
};

export const scoreGrowth = (snapshot: RepoSnapshot, rules: ScoringRules): number => {
  const growthRules = rules.weights.growth;
  let score = growthRules.base;

  score += Math.min(
    snapshot.commitsLast30d * growthRules.commitsLast30dFactor,
    growthRules.maxCommitContribution
  );
  score += Math.min(
    snapshot.mergedPrsLast30d * growthRules.mergedPrFactor,
    growthRules.maxMergedPrContribution
  );
  score += Math.min(snapshot.streakDays * growthRules.streakFactor, growthRules.maxStreakContribution);

  const commitBurstRatio = snapshot.commitsLast7d / Math.max(snapshot.commitsLast30d, 1);
  const inconsistentBurst = commitBurstRatio > growthRules.burstRatioThreshold && snapshot.streakDays < 3;
  if (inconsistentBurst) {
    score -= growthRules.burstPenaltyWhenInconsistent;
  }

  return clamp(round(score), 0, 100);
};

export const scoreChaos = (snapshot: RepoSnapshot, rules: ScoringRules): number => {
  const chaosRules = rules.weights.chaos;
  let score = chaosRules.base;

  if (snapshot.latestWorkflowConclusion === "failure") {
    score += chaosRules.latestFailureBonus;
  } else if (snapshot.latestWorkflowConclusion === "cancelled") {
    score += chaosRules.latestCancelledBonus;
  } else if (snapshot.latestWorkflowConclusion === "skipped") {
    score += chaosRules.latestSkippedBonus;
  }

  score += Math.min(
    snapshot.bugfixKeywordCount30d * chaosRules.bugfixKeywordFactor,
    chaosRules.maxBugfixContribution
  );

  const issueChurn = Math.abs(snapshot.issuesOpenedLast30d - snapshot.issuesClosedLast30d);
  score += Math.min(issueChurn * chaosRules.issueChurnFactor, chaosRules.maxIssueChurnContribution);

  const spikeRatio = snapshot.commitsLast7d / Math.max(snapshot.commitsLast30d, 1);
  if (snapshot.commitsLast7d >= chaosRules.spikeCommitThreshold && spikeRatio >= chaosRules.spikeRatioThreshold) {
    score += chaosRules.spikeBonus;
  }

  if (snapshot.workflowSuccessRate30d >= chaosRules.calmWorkflowSuccessThreshold) {
    score -= chaosRules.calmBonus;
  }

  return clamp(round(score), 0, 100);
};

export const scoreRepoSnapshot = (snapshot: RepoSnapshot, rules: ScoringRules): PetStats => {
  return {
    health: scoreHealth(snapshot, rules),
    mood: scoreMood(snapshot, rules),
    growth: scoreGrowth(snapshot, rules),
    chaos: scoreChaos(snapshot, rules)
  };
};
