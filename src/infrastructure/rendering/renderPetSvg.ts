import type { PetState } from "../../domain/entities/PetState.js";
import { renderBackground } from "./svgParts/renderBackground.js";
import { renderBody } from "./svgParts/renderBody.js";
import { renderEyes } from "./svgParts/renderEyes.js";
import { renderMouth } from "./svgParts/renderMouth.js";
import { renderStats } from "./svgParts/renderStats.js";
import { renderLabels } from "./svgParts/renderLabels.js";

export const renderPetSvg = (state: PetState): string => {
  const width = 640;
  const height = 240;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="RepoPet status card">
  ${renderBackground(width, height, state.expression)}
  ${renderBody(state.stage, state.expression)}
  ${renderEyes(state.expression)}
  ${renderMouth(state.expression)}
  ${renderStats(state.stats)}
  ${renderLabels(state)}
</svg>
`;
};
