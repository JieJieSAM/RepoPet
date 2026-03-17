export type ZooRepositoryVisibility = "public" | "private";

export interface ZooRepository {
  owner: string;
  name: string;
  fullName: string;
  description: string;
  language: string | null;
  defaultBranch: string;
  visibility: ZooRepositoryVisibility;
  isFork: boolean;
  isArchived: boolean;
  updatedAt: string;
  pushedAt: string;
}
