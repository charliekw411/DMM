import { PatternModule } from "./types";
// NOTE: Update this to match your actual icon import logic
import { BookIcon } from "lucide-react"; // fallback icon if none found

const patternFiles = import.meta.glob("./*.ts", { eager: true });

const patterns = import.meta.glob("./!(*index).ts", {
  eager: true,
}) as Record<string, { default: PatternModule }>;


export function loadPatterns(): PatternModule[] {
  return Object.values(patterns)
    .map((mod) => mod.default)
    .filter((mod) => mod && mod.name && mod.create);
}

export const loadedPatterns: PatternModule[] = Object.entries(patternFiles)
  .map(([path, mod]: any): PatternModule | null => {
    const fn = mod.createSpokePattern ?? mod.createHubAndSpokePattern;
    const name = path.split("/").pop()?.replace(".ts", "") ?? "Unnamed";

    if (!fn) {
      console.warn(`⚠️ Pattern ${name} has no exported create function`);
      return null;
    }

    return {
      type: name.toLowerCase(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      description: `Pattern from ${name}.ts`,
      icon: mod.icon ?? <BookIcon className="w-5 h-5" />,
      create: fn,
      initialVariables: mod.initialVariables ?? {},
    };
  })
  .filter((p): p is PatternModule => !!p && typeof p.create === "function");
