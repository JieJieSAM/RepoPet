import type { PetExpression } from "../../value-objects/PetExpression.js";
import type { PetStage } from "../../value-objects/PetStage.js";
import type { PetStats } from "../../value-objects/PetStats.js";
import type { PersonaProfile } from "./PersonaProfile.js";
import type { RepositoryStyleTag } from "../value-objects/RepositoryStyleTag.js";

export interface RankedRepository {
  name: string;
  fullName: string;
  score: number;
}

export interface RepositoryRankings {
  mostActive: RankedRepository | null;
  healthiest: RankedRepository | null;
  mostChaotic: RankedRepository | null;
  sleepiest: RankedRepository | null;
  highestGrowth: RankedRepository | null;
}

export interface AccountRepositorySummary {
  name: string;
  fullName: string;
  styleTag: RepositoryStyleTag;
  stats: PetStats;
  stage: PetStage;
  expression: PetExpression;
  statusLine: string;
  commitsLast30d: number;
  daysSinceLastCommit: number;
  workflowSuccessRate30d: number;
}

export interface AccountAggregateMetrics {
  averageStats: PetStats;
  activeReposCount: number;
  dormantReposCount: number;
  activitySpread: number;
  bugfixCommitRatio: number;
  workflowStability: number;
  recentActivityConcentration: number;
}

export interface AccountSummary {
  owner: string;
  generatedAt: string;
  totalReposScanned: number;
  metrics: AccountAggregateMetrics;
  styleDistribution: Record<RepositoryStyleTag, number>;
  rankings: RepositoryRankings;
  persona: PersonaProfile;
  repositories: AccountRepositorySummary[];
}
