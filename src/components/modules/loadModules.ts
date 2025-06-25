const moduleFiles = import.meta.glob("./*.ts", { eager: true });

const excluded = ["types.ts", "utils.ts"];

export const loadedModules = Object.entries(moduleFiles)
  .filter(([path]) => !excluded.some((e) => path.includes(e)))
  .map(([_, mod]: any) => mod.moduleDefinition)
  .filter((m) => m?.type && m?.name && m?.icon);
