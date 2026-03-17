import type { AccountRepositorySummary } from "../../domain/zoo/entities/AccountSummary.js";
import { speciesPresentationMap } from "../../domain/zoo/speciesMapping.js";

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const truncate = (value: string, max: number): string => {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 1)}…`;
};

const renderFace = (expression: AccountRepositorySummary["expression"], x: number, y: number): string => {
  if (expression === "sleepy") {
    return `
      <line x1="${x - 8}" y1="${y - 4}" x2="${x - 2}" y2="${y - 4}" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" />
      <line x1="${x + 2}" y1="${y - 4}" x2="${x + 8}" y2="${y - 4}" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" />
      <line x1="${x - 3}" y1="${y + 6}" x2="${x + 3}" y2="${y + 6}" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" />
    `;
  }

  if (expression === "chaotic") {
    return `
      <circle cx="${x - 5}" cy="${y - 4}" r="3.2" fill="#1E1E1E" />
      <circle cx="${x + 5}" cy="${y - 2}" r="2.6" fill="#1E1E1E" />
      <path d="M${x - 8} ${y + 6} L${x - 3} ${y + 10} L${x + 1} ${y + 6} L${x + 6} ${y + 10}" fill="none" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" />
    `;
  }

  if (expression === "sick") {
    return `
      <line x1="${x - 8}" y1="${y - 6}" x2="${x - 2}" y2="${y}" stroke="#1E1E1E" stroke-width="2" />
      <line x1="${x - 8}" y1="${y}" x2="${x - 2}" y2="${y - 6}" stroke="#1E1E1E" stroke-width="2" />
      <line x1="${x + 2}" y1="${y - 6}" x2="${x + 8}" y2="${y}" stroke="#1E1E1E" stroke-width="2" />
      <line x1="${x + 2}" y1="${y}" x2="${x + 8}" y2="${y - 6}" stroke="#1E1E1E" stroke-width="2" />
      <path d="M${x - 7} ${y + 8} Q${x} ${y + 2} ${x + 7} ${y + 8}" fill="none" stroke="#1E1E1E" stroke-width="2" />
    `;
  }

  if (expression === "proud" || expression === "happy") {
    return `
      <circle cx="${x - 5}" cy="${y - 4}" r="2.8" fill="#1E1E1E" />
      <circle cx="${x + 5}" cy="${y - 4}" r="2.8" fill="#1E1E1E" />
      <path d="M${x - 7} ${y + 5} Q${x} ${y + 11} ${x + 7} ${y + 5}" fill="none" stroke="#1E1E1E" stroke-width="2" />
    `;
  }

  return `
    <circle cx="${x - 5}" cy="${y - 4}" r="2.8" fill="#1E1E1E" />
    <circle cx="${x + 5}" cy="${y - 4}" r="2.8" fill="#1E1E1E" />
    <path d="M${x - 7} ${y + 8} Q${x} ${y + 3} ${x + 7} ${y + 8}" fill="none" stroke="#1E1E1E" stroke-width="2" />
  `;
};

const renderStat = (label: string, value: number, x: number, y: number, color: string): string => {
  const width = Math.max(0, Math.min(100, value)) * 0.9;
  return `
    <text x="${x}" y="${y}" font-family="Verdana, sans-serif" font-size="10" fill="#3C3C3C">${label}</text>
    <rect x="${x + 22}" y="${y - 8}" width="92" height="8" rx="4" fill="#F0F0F0" />
    <rect x="${x + 22}" y="${y - 8}" width="${width}" height="8" rx="4" fill="${color}" />
    <text x="${x + 118}" y="${y}" text-anchor="end" font-family="Verdana, sans-serif" font-size="10" fill="#3C3C3C">${value}</text>
  `;
};

export const renderZooCardSvg = (repository: AccountRepositorySummary, x: number, y: number): string => {
  const species = speciesPresentationMap[repository.species];
  const title = escapeXml(truncate(repository.name, 18));
  const statusLine = escapeXml(truncate(repository.statusLine, 28));

  return `
    <g transform="translate(${x}, ${y})">
      <rect x="0" y="0" width="370" height="164" rx="14" fill="#FFFFFF" stroke="#DCDCDC" />
      <circle cx="42" cy="44" r="24" fill="${species.primary}" stroke="${species.secondary}" stroke-width="3" />
      ${renderFace(repository.expression, 42, 44)}
      <text x="20" y="92" font-family="Verdana, sans-serif" font-size="11" fill="#303030">${species.emoji} ${species.label}</text>

      <text x="90" y="32" font-family="Verdana, sans-serif" font-size="15" font-weight="700" fill="#1F1F1F">${title}</text>
      <text x="90" y="52" font-family="Verdana, sans-serif" font-size="11" fill="#4D4D4D">阶段: ${repository.stage} · 风格: ${repository.styleTag}</text>
      <text x="90" y="70" font-family="Verdana, sans-serif" font-size="10.5" fill="#5A5A5A">${statusLine}</text>

      ${renderStat("H", repository.stats.health, 90, 95, "#2C8E5A")}
      ${renderStat("M", repository.stats.mood, 90, 113, "#246CA8")}
      ${renderStat("G", repository.stats.growth, 90, 131, "#A05B16")}
      ${renderStat("C", repository.stats.chaos, 90, 149, "#B44058")}
    </g>
  `;
};
