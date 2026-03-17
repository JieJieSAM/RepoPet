import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export interface WriteResult {
  changed: boolean;
  path: string;
}

export const writeFileIfChanged = async (path: string, contents: string): Promise<WriteResult> => {
  await mkdir(dirname(path), { recursive: true });

  let current: string | null = null;
  try {
    current = await readFile(path, "utf8");
  } catch {
    current = null;
  }

  if (current === contents) {
    return { changed: false, path };
  }

  await writeFile(path, contents, "utf8");
  return { changed: true, path };
};
