import { describe, expect, it } from "vitest";
import type { ZooRepository } from "../../../src/domain/zoo/entities/ZooRepository.js";
import { selectRepositoriesForZoo } from "../../../src/domain/zoo/services/selectRepositoriesForZoo.js";

const sampleRepositories: ZooRepository[] = [
  {
    owner: "acme",
    name: "alpha",
    fullName: "acme/alpha",
    description: "",
    language: "TypeScript",
    defaultBranch: "main",
    visibility: "public",
    isFork: false,
    isArchived: false,
    updatedAt: "2026-03-16T00:00:00.000Z",
    pushedAt: "2026-03-15T00:00:00.000Z"
  },
  {
    owner: "acme",
    name: "forked-beta",
    fullName: "acme/forked-beta",
    description: "",
    language: "Python",
    defaultBranch: "main",
    visibility: "public",
    isFork: true,
    isArchived: false,
    updatedAt: "2026-03-17T00:00:00.000Z",
    pushedAt: "2026-03-17T00:00:00.000Z"
  },
  {
    owner: "acme",
    name: "archived-gamma",
    fullName: "acme/archived-gamma",
    description: "",
    language: "Rust",
    defaultBranch: "main",
    visibility: "public",
    isFork: false,
    isArchived: true,
    updatedAt: "2026-03-14T00:00:00.000Z",
    pushedAt: "2026-03-14T00:00:00.000Z"
  },
  {
    owner: "acme",
    name: "private-delta",
    fullName: "acme/private-delta",
    description: "",
    language: "Go",
    defaultBranch: "main",
    visibility: "private",
    isFork: false,
    isArchived: false,
    updatedAt: "2026-03-13T00:00:00.000Z",
    pushedAt: "2026-03-17T00:00:00.000Z"
  }
];

describe("selectRepositoriesForZoo", () => {
  it("filters forks and archived repos by default-like options", () => {
    const selected = selectRepositoriesForZoo(sampleRepositories, {
      includeForks: false,
      includeArchived: false,
      maxRepos: 12,
      sortBy: "updated",
      visibility: "all"
    });

    expect(selected.map((repository) => repository.name)).toEqual(["alpha", "private-delta"]);
  });

  it("supports visibility filtering and sort by pushed", () => {
    const selected = selectRepositoriesForZoo(sampleRepositories, {
      includeForks: true,
      includeArchived: true,
      maxRepos: 12,
      sortBy: "pushed",
      visibility: "public"
    });

    expect(selected.map((repository) => repository.name)).toEqual([
      "forked-beta",
      "alpha",
      "archived-gamma"
    ]);
  });

  it("applies max repos cap after sorting", () => {
    const selected = selectRepositoriesForZoo(sampleRepositories, {
      includeForks: true,
      includeArchived: true,
      maxRepos: 2,
      sortBy: "name",
      visibility: "all"
    });

    expect(selected).toHaveLength(2);
    expect(selected[0]?.name).toBe("alpha");
    expect(selected[1]?.name).toBe("archived-gamma");
  });
});
