import { PatternModule } from "../modules/types";

const patternFiles = import.meta.glob("./*.ts", { eager: true });

const patterns = import.meta.glob("./!(*index).ts", {
  eager: true,
}) as Record<string, { default: PatternModule }>;

export function loadPatterns(): PatternModule[] {
  return Object.values(patterns)
    .map((mod) => mod.default)
    .filter((mod) => mod && mod.name && mod.create);
}

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
