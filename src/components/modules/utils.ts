import { loadedModules } from "./loadModules";
import { Module, ModuleType } from "./types";

export function createModule(
  type: string,
  id: string,
  x: number,
  y: number,
  variables: Record<string, string>
): Module {
  const definition = loadedModules.find((mod) => mod.type === type);
  if (!definition) {
    throw new Error(`Module definition not found for type "${type}"`);
  }

  return {
    id,
    name: variables.name || definition.name,
    type: definition.type as ModuleType,
    position: { x, y },
    variables: {
      ...definition.defaultVariables,
      ...variables,
    },
    resourceGroup: variables.resourceGroup ?? undefined,
  };
}
