import type { AccountSummary, RankedRepository } from "../../domain/zoo/entities/AccountSummary.js";
import { renderPersonaHeaderSvg } from "./renderPersonaHeaderSvg.js";
import { renderZooCardSvg } from "./renderZooCardSvg.js";

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const highlightText = (title: string, ranked: RankedRepository | null): string => {
  if (!ranked) {
    return `${title}: 暂无数据`;
  }
  return `${title}: ${ranked.name} (${ranked.score})`;
};

const renderHighlights = (summary: AccountSummary, y: number): string => {
  const lines = [
    highlightText("最活跃仓库", summary.rankings.mostActive),
    highlightText("最健康仓库", summary.rankings.healthiest),
    highlightText("最混沌仓库", summary.rankings.mostChaotic),
    highlightText("最想睡仓库", summary.rankings.sleepiest),
    `扫描仓库数: ${summary.totalReposScanned} · 活跃: ${summary.metrics.activeReposCount} · 冬眠: ${summary.metrics.dormantReposCount}`
  ];

  return `
    <rect x="16" y="${y}" width="1168" height="138" rx="16" fill="#FFFDF7" stroke="#E0D6C3" />
    <text x="36" y="${y + 28}" font-family="Verdana, sans-serif" font-size="16" font-weight="700" fill="#2B2B2B">Zoo Highlights</text>
    <text x="36" y="${y + 54}" font-family="Verdana, sans-serif" font-size="13" fill="#3E3E3E">${escapeXml(lines[0])}</text>
    <text x="36" y="${y + 76}" font-family="Verdana, sans-serif" font-size="13" fill="#3E3E3E">${escapeXml(lines[1])}</text>
    <text x="36" y="${y + 98}" font-family="Verdana, sans-serif" font-size="13" fill="#3E3E3E">${escapeXml(lines[2])}</text>
    <text x="620" y="${y + 54}" font-family="Verdana, sans-serif" font-size="13" fill="#3E3E3E">${escapeXml(lines[3])}</text>
    <text x="620" y="${y + 76}" font-family="Verdana, sans-serif" font-size="13" fill="#3E3E3E">${escapeXml(lines[4])}</text>
  `;
};

export const renderZooDashboardSvg = (summary: AccountSummary): string => {
  const columns = 3;
  const cardWidth = 370;
  const cardHeight = 164;
  const gapX = 16;
  const gapY = 14;
  const gridStartX = 16;
  const gridStartY = 196;
  const rows = Math.max(1, Math.ceil(summary.repositories.length / columns));
  const gridHeight = rows * cardHeight + (rows - 1) * gapY;
  const highlightY = gridStartY + gridHeight + 16;
  const width = 1200;
  const height = highlightY + 154;

  const cards = summary.repositories
    .map((repository, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const x = gridStartX + col * (cardWidth + gapX);
      const y = gridStartY + row * (cardHeight + gapY);
      return renderZooCardSvg(repository, x, y);
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="RepoPet Zoo Dashboard">
  <rect x="0" y="0" width="${width}" height="${height}" fill="#F6F2EA" />
  ${renderPersonaHeaderSvg(summary)}
  ${cards}
  ${renderHighlights(summary, highlightY)}
</svg>
`;
};
