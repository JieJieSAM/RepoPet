export const ZOO_SPECIES = [
  "neon_slime",
  "mage_cat",
  "block_bear",
  "mech_turtle",
  "armored_hedgehog",
  "candy_bird",
  "white_blob"
] as const;

export type ZooSpecies = (typeof ZOO_SPECIES)[number];

export interface SpeciesPresentation {
  species: ZooSpecies;
  label: string;
  emoji: string;
  primary: string;
  secondary: string;
}

interface SpeciesRule {
  languages: string[];
  species: ZooSpecies;
}

const normalizeLanguage = (language: string | null): string => (language ?? "").trim().toLowerCase();

export const speciesRules: SpeciesRule[] = [
  { languages: ["typescript", "javascript"], species: "neon_slime" },
  { languages: ["python"], species: "mage_cat" },
  { languages: ["java"], species: "block_bear" },
  { languages: ["c", "c++"], species: "mech_turtle" },
  { languages: ["rust"], species: "armored_hedgehog" },
  { languages: ["html", "css"], species: "candy_bird" }
];

export const speciesPresentationMap: Record<ZooSpecies, SpeciesPresentation> = {
  neon_slime: {
    species: "neon_slime",
    label: "霓虹史莱姆",
    emoji: "🟢",
    primary: "#43D17A",
    secondary: "#1C8C4A"
  },
  mage_cat: {
    species: "mage_cat",
    label: "法师猫",
    emoji: "🐱",
    primary: "#7FA0FF",
    secondary: "#3F5CB5"
  },
  block_bear: {
    species: "block_bear",
    label: "方块熊",
    emoji: "🧱",
    primary: "#D29A66",
    secondary: "#8F5A2D"
  },
  mech_turtle: {
    species: "mech_turtle",
    label: "机甲龟",
    emoji: "🐢",
    primary: "#6EAFA5",
    secondary: "#2D6F67"
  },
  armored_hedgehog: {
    species: "armored_hedgehog",
    label: "装甲刺猬",
    emoji: "🦔",
    primary: "#A78CD8",
    secondary: "#5A3D91"
  },
  candy_bird: {
    species: "candy_bird",
    label: "糖果鸟",
    emoji: "🐦",
    primary: "#FF9FAF",
    secondary: "#B34D63"
  },
  white_blob: {
    species: "white_blob",
    label: "白团子",
    emoji: "⚪",
    primary: "#D9E0E6",
    secondary: "#6A7682"
  }
};

export const deriveSpeciesFromLanguage = (language: string | null): ZooSpecies => {
  const normalized = normalizeLanguage(language);
  const matchedRule = speciesRules.find((rule) => rule.languages.includes(normalized));
  return matchedRule ? matchedRule.species : "white_blob";
};
