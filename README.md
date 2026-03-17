# RepoPet

<!-- REPOPET:START -->
![RepoPet](./assets/repopet.svg)
This repository has a living digital pet that evolves from project activity.
<!-- REPOPET:END -->

RepoPet turns a GitHub repository into a deterministic digital pet.  
The pet reads repository activity, computes a reproducible state, and renders an SVG card plus JSON state for debugging.

## How It Works

1. Fetch repository activity from GitHub (commits, PRs, issues, workflow runs).
2. Build a `RepoSnapshot` for a fixed lookback window.
3. Score four stats (`health`, `mood`, `growth`, `chaos`) with pure deterministic logic.
4. Derive stage, expression, level, title, and status line.
5. Generate:
   - `data/pet-state.json`
   - `assets/repopet.svg`
6. Keep the README pet block updated.

## Setup

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install

```bash
pnpm install
```

### Required Environment Variables

- `GITHUB_TOKEN`: GitHub token with read access to repository activity (and write access when auto-committing in Actions)
- `GITHUB_REPOSITORY`: repository slug in `owner/repo` format

### Optional Environment Variables

- `REPOPET_DRY_RUN`: set `true` or `1` to run generation without writing files

## Local Commands

- `pnpm generate:pet`  
  Generate and write JSON + SVG + README block.

- `pnpm generate:pet:dry`  
  Compute everything and print summary logs without writing files.

- `pnpm test`  
  Run unit, snapshot, and integration tests.

- `pnpm lint`  
  Run TypeScript lint checks.

## Architecture

RepoPet follows a five-layer structure:

- Domain (`src/domain`): pure scoring/evolution logic and core types.
- Application (`src/application`): generation orchestration use case.
- Infrastructure (`src/infrastructure`): GitHub API, file storage, config loading, SVG renderer.
- CLI (`src/cli`): single entrypoint and exit behavior.
- Automation (`.github/workflows`): daily scheduled regeneration and commit.

## GitHub Actions Automation

Workflow file: `.github/workflows/update-pet.yml`

Triggers:

- Daily schedule
- Manual run (`workflow_dispatch`)

The workflow:

1. Installs dependencies.
2. Runs `pnpm generate:pet`.
3. Commits generated artifacts when changed (`data/pet-state.json`, `assets/repopet.svg`, `README.md`).

## Customizing Scoring Rules

Edit `src/domain/config/scoringRules.ts` to tune:

- lookback windows
- stat formula weights and penalties
- stage thresholds
- expression thresholds
- bugfix keywords
- status line templates
- output paths and README insertion markers

All scoring behavior is deterministic and testable.
