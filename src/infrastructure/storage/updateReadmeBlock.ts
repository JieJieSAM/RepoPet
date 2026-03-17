import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import type { WriteResult } from "./writeFileIfChanged.js";

export interface ReadmeBlockConfig {
  startMarker: string;
  endMarker: string;
  imageMarkdown: string;
  description: string;
}

const buildBlock = (config: ReadmeBlockConfig): string => {
  return `${config.startMarker}
${config.imageMarkdown}
${config.description}
${config.endMarker}`;
};

export const updateReadmeBlock = async (
  readmePath: string,
  config: ReadmeBlockConfig
): Promise<WriteResult> => {
  await mkdir(dirname(readmePath), { recursive: true });

  const block = buildBlock(config);
  let current = "";

  try {
    current = await readFile(readmePath, "utf8");
  } catch {
    current = "";
  }

  const blockPattern = new RegExp(
    `${config.startMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${config.endMarker.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )}`,
    "m"
  );

  const trimmed = current.trimEnd();
  const next = blockPattern.test(current)
    ? current.replace(blockPattern, block)
    : trimmed.length > 0
      ? `${trimmed}\n\n${block}\n`
      : `${block}\n`;

  if (next === current) {
    return { changed: false, path: readmePath };
  }

  await writeFile(readmePath, next, "utf8");
  return { changed: true, path: readmePath };
};
