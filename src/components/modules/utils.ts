import { loadedModules } from "./loadModules";
import { Module, ModuleType } from "./types";
import type { VariableSchema } from "../common/ModuleConfigModal";

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
      ...definition.initialVariables,
      ...variables,
    },
    resourcegroup: variables.resourceGroup ?? undefined,
  };
}

export const validateCidr = (value: string): true | string => {
  const cidrRegex = /^(?:\d{1,3}\.){3}\d{1,3}\/(?:[0-9]|[1-2][0-9]|3[0-2])$/;
  return cidrRegex.test(value) ? true : "Invalid CIDR (e.g., 10.0.0.0/16)";
};

export function validateVariables(
  schema: Record<string, any>,
  values: Record<string, any>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const key in schema) {
    const field = schema[key];
    const value = values[key];

    if (field.required && !value?.trim?.()) {
      errors[key] = `${field.label} is required`;
    } else if (field.validate) {
      const result = field.validate(value);
      // Accept null or any non-true value as error
      if (result !== true) {
        errors[key] = result || `${field.label} is invalid`;
      }
    }
  }

  return errors;
}
export function getAutoName(type: string, modules: Module[]): string {
  const count = modules.filter((m) => m.type === type).length + 1;
  return `${type}-${count}`;
}
export function getDefaultCidr(type: "vnet" | "subnet", count: number): string {
  if (type === "vnet") {
    return `10.${count}.0.0/16`; // e.g. 10.0.0.0/16, 10.1.0.0/16
  } else {
    const vnetIndex = Math.floor(count / 5); // every 5 subnets per VNet
    const subnetIndex = count % 5;
    return `10.${vnetIndex}.${subnetIndex}.0/24`; // e.g. 10.0.0.0/24
  }
}