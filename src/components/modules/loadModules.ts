// src/components/modules/loadModules.ts
import type { ModuleDefinition } from "./types";

// Eagerly import all *.ts files in the current folder
const moduleFiles = import.meta.glob("./*.ts", { eager: true });
const excluded = ["types.ts", "utils.ts", "loadedModules.ts", "variableSchemas.ts", "icons.tsx"];

export const loadedModules: ModuleDefinition[] = Object.entries(moduleFiles)
  .filter(([path]) => !excluded.some((e) => path.includes(e)))
  .map(([_, mod]: any) => mod?.default?.moduleDefinition)
  .filter((m: ModuleDefinition | undefined): m is ModuleDefinition => {
    const valid = !!m?.type && !!m?.name && !!m?.variableSchema;
    if (!valid) {
      console.warn("⚠️ Skipping invalid module:", m);
    }
    return valid;
  });
