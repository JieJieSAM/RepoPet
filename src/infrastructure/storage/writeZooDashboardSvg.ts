import type { WriteResult } from "./writeFileIfChanged.js";
import { writeSvg } from "./writeSvg.js";

export const writeZooDashboardSvg = async (path: string, svg: string): Promise<WriteResult> => {
  return writeSvg(path, svg);
};
