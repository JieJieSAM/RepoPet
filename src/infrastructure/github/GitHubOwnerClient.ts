import { Octokit } from "@octokit/rest";
import { selectRepositoriesForZoo } from "../../domain/zoo/services/selectRepositoriesForZoo.js";
import type { ZooRepository } from "../../domain/zoo/entities/ZooRepository.js";
import type { ZooSelectionOptions } from "../../domain/zoo/value-objects/ZooSelectionOptions.js";
import type { GitHubOwnerRepositoryRaw } from "../../types/github.js";
import { mapOwnerRepos } from "./mapOwnerRepos.js";

interface LoggerLike {
  info(message: string): void;
  warn(message: string): void;
}

const isNotFoundError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return (error as { status?: unknown }).status === 404;
};

export class GitHubOwnerClient {
  private readonly octokit: Octokit;
  private readonly owner: string;
  private readonly logger: LoggerLike;

  public constructor(params: { token: string; owner: string; logger: LoggerLike }) {
    this.octokit = params.token === "__ANON__" ? new Octokit() : new Octokit({ auth: params.token });
    this.owner = params.owner;
    this.logger = params.logger;
  }

  public async fetchRepositories(options: ZooSelectionOptions): Promise<ZooRepository[]> {
    const repositories = await this.fetchOwnerRepositoriesRaw();
    const mapped = mapOwnerRepos(repositories);
    const selected = selectRepositoriesForZoo(mapped, options);

    this.logger.info(
      `Owner repository selection complete: scanned=${mapped.length}, selected=${selected.length}, sortBy=${options.sortBy}`
    );

    return selected;
  }

  private async fetchOwnerRepositoriesRaw(): Promise<GitHubOwnerRepositoryRaw[]> {
    const perPage = 100;

    try {
      const userRepositories = await this.octokit.paginate(this.octokit.repos.listForUser, {
        username: this.owner,
        sort: "updated",
        per_page: perPage
      });
      return userRepositories as GitHubOwnerRepositoryRaw[];
    } catch (error: unknown) {
      if (!isNotFoundError(error)) {
        throw new Error(`Unable to fetch repositories for owner '${this.owner}': ${(error as Error).message}`);
      }
    }

    try {
      const organizationRepositories = await this.octokit.paginate(this.octokit.repos.listForOrg, {
        org: this.owner,
        type: "all",
        sort: "updated",
        per_page: perPage
      });
      return organizationRepositories as GitHubOwnerRepositoryRaw[];
    } catch (error: unknown) {
      this.logger.warn(
        `Unable to fetch repositories for '${this.owner}' as org: ${(error as Error).message}`
      );
      throw new Error(`Owner '${this.owner}' was not found as user or organization.`);
    }
  }
}
