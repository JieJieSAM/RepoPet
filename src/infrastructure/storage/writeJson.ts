import { writeFileIfChanged, type WriteResult } from "./writeFileIfChanged.js";

export const writeJson = async (path: string, value: unknown): Promise<WriteResult> => {
  const contents = `${JSON.stringify(value, null, 2)}\n`;
  return writeFileIfChanged(path, contents);
};
