import type { PetState } from "../../../domain/entities/PetState.js";

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const renderLabels = (state: PetState): string => {
  const safeTitle = escapeXml(state.title);
  const safeStatus = escapeXml(state.statusLine);
  const safeMeta = escapeXml(
    `${state.snapshot.owner}/${state.snapshot.repo} • ${state.snapshot.defaultBranch} • ${state.lastUpdated.slice(0, 10)}`
  );
  const safeStage = escapeXml(`Stage: ${state.stage}`);
  const safeExpression = escapeXml(`Expression: ${state.expression}`);
  const safeLevel = escapeXml(`Level ${state.level}`);

  return `
    <text x="26" y="38" font-family="Verdana, sans-serif" font-size="24" font-weight="700" fill="#182025">RepoPet</text>
    <text x="26" y="60" font-family="Verdana, sans-serif" font-size="14" fill="#23343D">${safeLevel} • ${safeTitle}</text>
    <text x="26" y="194" font-family="Verdana, sans-serif" font-size="13" fill="#1F2A31">${safeStatus}</text>
    <text x="26" y="212" font-family="Verdana, sans-serif" font-size="11" fill="#3A515B">${safeMeta}</text>
    <text x="316" y="34" font-family="Verdana, sans-serif" font-size="12" fill="#22323A">${safeStage} • ${safeExpression}</text>
  `;
};
