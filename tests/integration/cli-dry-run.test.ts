import { describe, expect, it, vi } from "vitest";
import { runCli } from "../../src/cli/main.js";
import { rawActivityFixture } from "../fixtures/github/rawActivity.js";
import type { LoadedConfig } from "../../src/infrastructure/config/loadConfig.js";
import { scoringRules } from "../../src/domain/config/scoringRules.js";

const mockConfig: LoadedConfig = {
  github: {
    token: "token",
    owner: "acme",
    repo: "repopet"
  },
  dryRun: true,
  rules: scoringRules,
  outputPaths: {
    json: "data/pet-state.json",
    svg: "assets/repopet.svg",
    readme: "README.md"
  }
};

describe("CLI dry-run", () => {
  it("completes successfully without writing files", async () => {
    const writeJsonSpy = vi.fn(() => Promise.resolve({ changed: false, path: "data/pet-state.json" }));
    const writeSvgSpy = vi.fn(() => Promise.resolve({ changed: false, path: "assets/repopet.svg" }));
    const updateReadmeSpy = vi.fn(() => Promise.resolve({ changed: false, path: "README.md" }));

    const result = await runCli(["--dry-run"], {
      loadConfig: () => mockConfig,
      fetchActivitySnapshot: () => Promise.resolve(rawActivityFixture),
      writeJson: writeJsonSpy,
      writeSvg: writeSvgSpy,
      updateReadmeBlock: updateReadmeSpy
    });

    expect(result.exitCode).toBe(0);
    expect(writeJsonSpy).not.toHaveBeenCalled();
    expect(writeSvgSpy).not.toHaveBeenCalled();
    expect(updateReadmeSpy).not.toHaveBeenCalled();
  });
});
