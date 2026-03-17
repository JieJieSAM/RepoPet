import { writeFileIfChanged, type WriteResult } from "./writeFileIfChanged.js";

export const writeSvg = async (path: string, svg: string): Promise<WriteResult> => {
  return writeFileIfChanged(path, svg);
};
