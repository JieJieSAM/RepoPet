import { describe, expect, it } from "vitest";
import type { GitHubOwnerRepositoryRaw } from "../../src/types/github.js";
import { mapOwnerRepos } from "../../src/infrastructure/github/mapOwnerRepos.js";

describe("mapOwnerRepos", () => {
  it("maps raw GitHub repositories into normalized zoo repositories", () => {
    const raw: GitHubOwnerRepositoryRaw[] = [
      {
        name: "repopet",
        full_name: "acme/repopet",
        owner: { login: "acme" },
        description: null,
        language: "TypeScript",
        default_branch: "main",
        private: false,
        fork: false,
        archived: false,
        updated_at: "2026-03-16T00:00:00.000Z",
        pushed_at: "2026-03-15T00:00:00.000Z"
      }
    ];

    const mapped = mapOwnerRepos(raw);

    expect(mapped).toEqual([
      {
        owner: "acme",
        name: "repopet",
        fullName: "acme/repopet",
        description: "",
        language: "TypeScript",
        defaultBranch: "main",
        visibility: "public",
        isFork: false,
        isArchived: false,
        updatedAt: "2026-03-16T00:00:00.000Z",
        pushedAt: "2026-03-15T00:00:00.000Z"
      }
    ]);
  });
});
