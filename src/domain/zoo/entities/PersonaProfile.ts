import type { PetExpression } from "../../value-objects/PetExpression.js";

export const PERSONA_TYPES = [
  "order_keeper",
  "late_night_grinder",
  "bugfix_hero",
  "hibernation_keeper",
  "split_brain_zookeeper"
] as const;

export type PersonaType = (typeof PERSONA_TYPES)[number];

export interface PersonaProfile {
  personaType: PersonaType;
  personaTitle: string;
  personaMood: PetExpression;
  personaSummary: string;
  dominantTrait: string;
  warningTrait: string;
}
