export interface ScoringRules {
  lookbackWindows: {
    shortWindowDays: number;
    longWindowDays: number;
    streakWindowDays: number;
  };
  weights: {
    health: {
      base: number;
      workflowSuccessRateFactor: number;
      latestConclusionImpact: Record<"success" | "failure" | "cancelled" | "skipped" | "unknown", number>;
      openIssuesGrace: number;
      openIssuePenaltyPerIssue: number;
      maxIssuePenalty: number;
      freshnessGraceDays: number;
      stalePenaltyPerDay: number;
      maxStalePenalty: number;
      issueClosureBonusFactor: number;
      maxClosureSwing: number;
    };
    mood: {
      base: number;
      streakFactor: number;
      maxStreakBoost: number;
      commitsLast7dFactor: number;
      maxCommitsBoost: number;
      mergedPrFactor: number;
      maxMergedPrBoost: number;
      inactivityPenaltyPerDay: number;
      maxInactivityPenalty: number;
    };
    growth: {
      base: number;
      commitsLast30dFactor: number;
      maxCommitContribution: number;
      mergedPrFactor: number;
      maxMergedPrContribution: number;
      streakFactor: number;
      maxStreakContribution: number;
      burstRatioThreshold: number;
      burstPenaltyWhenInconsistent: number;
    };
    chaos: {
      base: number;
      latestFailureBonus: number;
      latestCancelledBonus: number;
      latestSkippedBonus: number;
      bugfixKeywordFactor: number;
      maxBugfixContribution: number;
      issueChurnFactor: number;
      maxIssueChurnContribution: number;
      spikeCommitThreshold: number;
      spikeRatioThreshold: number;
      spikeBonus: number;
      calmWorkflowSuccessThreshold: number;
      calmBonus: number;
    };
  };
  stageThresholds: {
    babyMinGrowth: number;
    teenMinGrowth: number;
    finalMinGrowth: number;
  };
  expressionThresholds: {
    sickHealthMax: number;
    chaoticChaosMin: number;
    sleepyMoodMax: number;
    proudMoodMin: number;
    proudGrowthMin: number;
    happyMoodMin: number;
  };
  bugfixKeywords: string[];
  statusLineTemplates: Record<string, string[]>;
  outputPaths: {
    json: string;
    svg: string;
    readme: string;
  };
  readmeBlock: {
    startMarker: string;
    endMarker: string;
    imageMarkdown: string;
    description: string;
  };
}

export const scoringRules: ScoringRules = {
  lookbackWindows: {
    shortWindowDays: 7,
    longWindowDays: 30,
    streakWindowDays: 60
  },
  weights: {
    health: {
      base: 58,
      workflowSuccessRateFactor: 0.26,
      latestConclusionImpact: {
        success: 8,
        failure: -20,
        cancelled: -8,
        skipped: -4,
        unknown: 0
      },
      openIssuesGrace: 15,
      openIssuePenaltyPerIssue: 0.6,
      maxIssuePenalty: 22,
      freshnessGraceDays: 2,
      stalePenaltyPerDay: 2.4,
      maxStalePenalty: 26,
      issueClosureBonusFactor: 0.9,
      maxClosureSwing: 10
    },
    mood: {
      base: 34,
      streakFactor: 2.8,
      maxStreakBoost: 24,
      commitsLast7dFactor: 3.5,
      maxCommitsBoost: 24,
      mergedPrFactor: 4.5,
      maxMergedPrBoost: 18,
      inactivityPenaltyPerDay: 2.6,
      maxInactivityPenalty: 30
    },
    growth: {
      base: 6,
      commitsLast30dFactor: 1.05,
      maxCommitContribution: 48,
      mergedPrFactor: 3.3,
      maxMergedPrContribution: 24,
      streakFactor: 1.45,
      maxStreakContribution: 26,
      burstRatioThreshold: 0.8,
      burstPenaltyWhenInconsistent: 8
    },
    chaos: {
      base: 14,
      latestFailureBonus: 24,
      latestCancelledBonus: 9,
      latestSkippedBonus: 4,
      bugfixKeywordFactor: 3.8,
      maxBugfixContribution: 30,
      issueChurnFactor: 1.2,
      maxIssueChurnContribution: 20,
      spikeCommitThreshold: 8,
      spikeRatioThreshold: 0.62,
      spikeBonus: 10,
      calmWorkflowSuccessThreshold: 85,
      calmBonus: 8
    }
  },
  stageThresholds: {
    babyMinGrowth: 20,
    teenMinGrowth: 45,
    finalMinGrowth: 75
  },
  expressionThresholds: {
    sickHealthMax: 25,
    chaoticChaosMin: 75,
    sleepyMoodMax: 30,
    proudMoodMin: 75,
    proudGrowthMin: 50,
    happyMoodMin: 60
  },
  bugfixKeywords: ["fix", "bug", "hotfix", "patch", "rollback"],
  statusLineTemplates: {
    sick: [
      "CI is coughing again. Please feed me cleaner commits.",
      "Systems shaky. I need tests, naps, and fewer fires."
    ],
    chaotic: [
      "Signal lost in merge turbulence. Hold onto your branches.",
      "Hotfix storm detected. I am spinning with compile anxiety."
    ],
    sleepy: [
      "Quiet week. I am entering low-power mode.",
      "Repository heartbeat is faint. Wake me with a PR."
    ],
    proud: [
      "Merged code detected. Evolution energy rising.",
      "Stable build, good mood, still hungry for PRs."
    ],
    happy: [
      "Steady commits keep my pixels sparkling.",
      "Momentum looks healthy. I am thriving on this cadence."
    ],
    stressed: [
      "I am stable-ish, but the backlog is staring at me.",
      "Work is moving, chaos is manageable, caffeine is implied."
    ]
  },
  outputPaths: {
    json: "data/pet-state.json",
    svg: "assets/repopet.svg",
    readme: "README.md"
  },
  readmeBlock: {
    startMarker: "<!-- REPOPET:START -->",
    endMarker: "<!-- REPOPET:END -->",
    imageMarkdown: "![RepoPet](./assets/repopet.svg)",
    description: "This repository has a living digital pet that evolves from project activity."
  }
};
