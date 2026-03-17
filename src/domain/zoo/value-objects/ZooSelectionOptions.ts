import type { ZooRepositoryVisibility } from "../entities/ZooRepository.js";

export type ZooSortBy = "updated" | "pushed" | "name";
export type ZooVisibilityFilter = "all" | ZooRepositoryVisibility;

export interface ZooSelectionOptions {
  includeForks: boolean;
  includeArchived: boolean;
  maxRepos: number;
  sortBy: ZooSortBy;
  visibility: ZooVisibilityFilter;
}
