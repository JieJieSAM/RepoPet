import type { AccountSummary } from "../../domain/zoo/entities/AccountSummary.js";
import { writeJson } from "./writeJson.js";
import type { WriteResult } from "./writeFileIfChanged.js";

export const writeAccountSummary = async (
  path: string,
  summary: AccountSummary
): Promise<WriteResult> => {
  return writeJson(path, summary);
};
