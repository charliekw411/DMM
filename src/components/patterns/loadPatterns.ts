import { PatternModule } from "../modules/types";
import * as spoke from "./spoke";
import * as hubAndSpoke from "./hubAndSpoke";

export function loadPatterns(): PatternModule[] {
  return [spoke, hubAndSpoke];
}
const patternFiles = import.meta.glob("./*.ts", { eager: true });

export const loadedPatterns = Object.entries(patternFiles)
  .map(([path, mod]: any) => {
    const fn = mod.createSpokePattern ?? mod.createHubAndSpokePattern;
    const name = path.split("/").pop()?.replace(".ts", "") ?? "Unnamed";

    if (!fn) {
      console.warn(`Pattern ${name} has no exported create function`);
      return null;
    }

    return {
      name,
      create: fn,
    };
  })
  .filter(Boolean);
