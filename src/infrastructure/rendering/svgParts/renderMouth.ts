import type { PetExpression } from "../../../domain/value-objects/PetExpression.js";

export const renderMouth = (expression: PetExpression): string => {
  if (expression === "happy" || expression === "proud") {
    return `<path d="M166 132 Q180 146 194 132" fill="none" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />`;
  }

  if (expression === "sleepy") {
    return `<line x1="172" y1="134" x2="188" y2="134" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />`;
  }

  if (expression === "sick") {
    return `<path d="M168 138 Q180 128 192 138" fill="none" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />`;
  }

  if (expression === "chaotic") {
    return `<path d="M166 132 L172 136 L178 130 L184 136 L190 130 L196 134" fill="none" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />`;
  }

  return `<path d="M166 137 Q180 128 194 137" fill="none" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />`;
};
