import type { AccountSummary } from "../../domain/zoo/entities/AccountSummary.js";

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const moodLabel: Record<AccountSummary["persona"]["personaMood"], string> = {
  happy: "开心",
  proud: "骄傲",
  sleepy: "想睡",
  stressed: "紧绷",
  sick: "虚弱",
  chaotic: "混沌"
};

export const renderPersonaHeaderSvg = (summary: AccountSummary): string => {
  const mood = moodLabel[summary.persona.personaMood];
  const ownerLabel = escapeXml(summary.owner);
  const personaTitle = escapeXml(summary.persona.personaTitle);
  const personaSummary = escapeXml(summary.persona.personaSummary);
  const dominantTrait = escapeXml(summary.persona.dominantTrait);
  const warningTrait = escapeXml(summary.persona.warningTrait);

  return `
    <rect x="16" y="16" width="1168" height="164" rx="18" fill="#FFF8E9" stroke="#E2C99B" stroke-width="2" />
    <text x="36" y="52" font-family="Verdana, sans-serif" font-size="28" font-weight="700" fill="#2D2A26">RepoPet Zoo · ${ownerLabel}</text>
    <text x="36" y="82" font-family="Verdana, sans-serif" font-size="20" fill="#5C3B1C">${personaTitle}</text>
    <text x="36" y="110" font-family="Verdana, sans-serif" font-size="14" fill="#3A3A3A">${personaSummary}</text>
    <text x="36" y="136" font-family="Verdana, sans-serif" font-size="13" fill="#3A3A3A">主导特征: ${dominantTrait}</text>
    <text x="36" y="158" font-family="Verdana, sans-serif" font-size="13" fill="#864E39">提醒信号: ${warningTrait}</text>

    <rect x="840" y="34" width="320" height="126" rx="14" fill="#FFFFFF" stroke="#EAD8B8" />
    <text x="860" y="62" font-family="Verdana, sans-serif" font-size="13" fill="#4B3B2A">人格心情: ${mood}</text>
    <text x="860" y="84" font-family="Verdana, sans-serif" font-size="12" fill="#4B3B2A">平均健康: ${summary.metrics.averageStats.health}</text>
    <text x="860" y="103" font-family="Verdana, sans-serif" font-size="12" fill="#4B3B2A">平均成长: ${summary.metrics.averageStats.growth}</text>
    <text x="860" y="122" font-family="Verdana, sans-serif" font-size="12" fill="#4B3B2A">活跃仓库: ${summary.metrics.activeReposCount}</text>
    <text x="860" y="141" font-family="Verdana, sans-serif" font-size="12" fill="#4B3B2A">冬眠仓库: ${summary.metrics.dormantReposCount}</text>
  `;
};
