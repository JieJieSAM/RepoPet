import { pathToFileURL } from "node:url";
import { generateZoo, type GenerateZooDependencies } from "../application/generateZoo.js";

export interface ZooCliResult {
  exitCode: number;
}

const hasFlag = (args: string[], ...flags: string[]): boolean => {
  return args.some((arg) => flags.includes(arg));
};

export const runZooCli = async (
  args: string[] = process.argv.slice(2),
  dependencies: GenerateZooDependencies = {}
): Promise<ZooCliResult> => {
  if (hasFlag(args, "-h", "--help")) {
    console.log("Usage: pnpm generate:zoo [--dry-run]");
    return { exitCode: 0 };
  }

  const dryRunFlag = hasFlag(args, "--dry-run", "--dry");

  try {
    const result = await generateZoo({ dryRunFlag }, dependencies);
    console.log(
      `RepoPet zoo generation complete. owner=${result.summary.owner}, repos=${result.summary.totalReposScanned}, persona=${result.summary.persona.personaType}, dryRun=${result.dryRun}`
    );
    return { exitCode: 0 };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown fatal error";
    console.error(`RepoPet zoo generation failed: ${message}`);
    return { exitCode: 1 };
  }
};

const isDirectRun = (): boolean => {
  const entryPath = process.argv[1];
  if (!entryPath) {
    return false;
  }

  return import.meta.url === pathToFileURL(entryPath).href;
};

if (isDirectRun()) {
  runZooCli()
    .then((result) => {
      process.exitCode = result.exitCode;
    })
    .catch((error: unknown) => {
      console.error(`RepoPet zoo generation failed unexpectedly: ${String(error)}`);
      process.exitCode = 1;
    });
}
