import type { PetExpression } from "../../../domain/value-objects/PetExpression.js";

export const renderEyes = (expression: PetExpression): string => {
  if (expression === "sleepy") {
    return `
      <line x1="164" y1="116" x2="174" y2="116" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />
      <line x1="186" y1="116" x2="196" y2="116" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />
    `;
  }

  if (expression === "sick") {
    return `
      <line x1="163" y1="112" x2="173" y2="120" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />
      <line x1="163" y1="120" x2="173" y2="112" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />
      <line x1="187" y1="112" x2="197" y2="120" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />
      <line x1="187" y1="120" x2="197" y2="112" stroke="#1E1E1E" stroke-width="3" stroke-linecap="round" />
    `;
  }

  if (expression === "chaotic") {
    return `
      <circle cx="168" cy="116" r="6" fill="#1E1E1E" />
      <circle cx="192" cy="113" r="4" fill="#1E1E1E" />
      <circle cx="170" cy="114" r="2" fill="#FFFFFF" />
      <circle cx="193" cy="112" r="1.5" fill="#FFFFFF" />
    `;
  }

  return `
    <circle cx="168" cy="114" r="5" fill="#1E1E1E" />
    <circle cx="192" cy="114" r="5" fill="#1E1E1E" />
    <circle cx="170" cy="112" r="1.8" fill="#FFFFFF" />
    <circle cx="194" cy="112" r="1.8" fill="#FFFFFF" />
  `;
};
