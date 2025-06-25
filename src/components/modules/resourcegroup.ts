// src/components/modules/resourcegroup.ts
import { ResourceGroupIcon } from "./icons";
import { Module, ModuleType } from "./types";
import { v4 as uuidv4 } from "uuid";

export function createResourceGroup(name: string, x: number, y: number): Module {
  return {
    id: uuidv4(),
    type: "resourceGroup",
    name,
    position: { x, y },
    variables: {
      name,
      region: "eastus",
    },
    width: 320,
    height: 220,
  };
}

export default {
  name: "Resource Group",
  type: "resourceGroup" as ModuleType,
  icon: ResourceGroupIcon,
  defaultVariables: {
    name: "rg-main",
    region: "eastus",
  },
};
