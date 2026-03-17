import { describe, expect, it, vi } from "vitest";
import { runZooCli } from "../../src/cli/zoo.js";
import type { LoadedZooConfig } from "../../src/infrastructure/config/loadZooConfig.js";
import { zooRepositoryPetsFixture } from "../fixtures/zoo/repositoryPets.js";

const mockZooConfig: LoadedZooConfig = {
  github: {
    token: "token",
    owner: "acme"
  },
  dryRun: true,
  selection: {
    includeForks: false,
    includeArchived: false,
    maxRepos: 12,
    sortBy: "updated",
    visibility: "all"
  }
};

describe("zoo CLI dry-run", () => {
  it("completes successfully without writing files", async () => {
    const writeSummarySpy = vi.fn(() =>
      Promise.resolve({ changed: false, path: "data/account-summary.json" })
    );
    const writeSvgSpy = vi.fn(() =>
      Promise.resolve({ changed: false, path: "assets/zoo-dashboard.svg" })
    );

    const result = await runZooCli(["--dry-run"], {
      loadZooConfig: () => mockZooConfig,
      fetchRepositoryPets: () => Promise.resolve(zooRepositoryPetsFixture),
      writeAccountSummary: writeSummarySpy,
      writeZooDashboardSvg: writeSvgSpy
    });

    expect(result.exitCode).toBe(0);
    expect(writeSummarySpy).not.toHaveBeenCalled();
    expect(writeSvgSpy).not.toHaveBeenCalled();
  });
});
