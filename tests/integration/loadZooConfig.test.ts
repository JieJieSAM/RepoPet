import { describe, expect, it } from "vitest";
import { loadZooConfig } from "../../src/infrastructure/config/loadZooConfig.js";

describe("loadZooConfig", () => {
  it("loads defaults when optional env vars are absent", () => {
    const config = loadZooConfig({
      env: {
        GITHUB_TOKEN: "token",
        GITHUB_OWNER: "acme"
      }
    });

    expect(config.github.owner).toBe("acme");
    expect(config.selection.includeForks).toBe(false);
    expect(config.selection.includeArchived).toBe(false);
    expect(config.selection.maxRepos).toBe(12);
    expect(config.selection.sortBy).toBe("updated");
    expect(config.selection.visibility).toBe("all");
    expect(config.dryRun).toBe(false);
  });

  it("parses explicit zoo env vars", () => {
    const config = loadZooConfig({
      env: {
        GITHUB_TOKEN: "token",
        GITHUB_OWNER: "acme",
        REPOPET_INCLUDE_FORKS: "true",
        REPOPET_INCLUDE_ARCHIVED: "1",
        REPOPET_MAX_REPOS: "8",
        REPOPET_SORT_BY: "name",
        REPOPET_REPO_VISIBILITY: "public",
        REPOPET_DRY_RUN: "1"
      }
    });

    expect(config.selection.includeForks).toBe(true);
    expect(config.selection.includeArchived).toBe(true);
    expect(config.selection.maxRepos).toBe(8);
    expect(config.selection.sortBy).toBe("name");
    expect(config.selection.visibility).toBe("public");
    expect(config.dryRun).toBe(true);
  });

  it("throws for invalid sort option", () => {
    expect(() =>
      loadZooConfig({
        env: {
          GITHUB_TOKEN: "token",
          GITHUB_OWNER: "acme",
          REPOPET_SORT_BY: "stars"
        }
      })
    ).toThrowError("REPOPET_SORT_BY must be one of: updated, pushed, name.");
  });
});
