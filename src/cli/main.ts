import { generatePet, type GeneratePetDependencies } from "../application/generatePet.js";
import { pathToFileURL } from "node:url";

export interface CliResult {
  exitCode: number;
}

const hasFlag = (args: string[], ...flags: string[]): boolean => {
  return args.some((arg) => flags.includes(arg));
};

export const runCli = async (
  args: string[] = process.argv.slice(2),
  dependencies: GeneratePetDependencies = {}
): Promise<CliResult> => {
  if (hasFlag(args, "-h", "--help")) {
    console.log("Usage: pnpm generate:pet [--dry-run]");
    return { exitCode: 0 };
  }

  const dryRunFlag = hasFlag(args, "--dry-run", "--dry");

  try {
    const result = await generatePet({ dryRunFlag }, dependencies);
    console.log(
      `RepoPet generation complete. stage=${result.state.stage}, expression=${result.state.expression}, dryRun=${result.dryRun}`
    );
    return { exitCode: 0 };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown fatal error";
    console.error(`RepoPet generation failed: ${message}`);
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
  runCli()
    .then((result) => {
      process.exitCode = result.exitCode;
    })
    .catch((error: unknown) => {
      console.error(`RepoPet generation failed unexpectedly: ${String(error)}`);
      process.exitCode = 1;
    });
}
