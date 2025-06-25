// src/components/modules/vnet.ts
import { VNetIcon } from "./icons";
import { Module, ModuleType } from "./types";
import { v4 as uuidv4 } from "uuid";

export function createVNet(name: string, x: number, y: number): Module {
  return {
    id: uuidv4(),
    type: "vnet",
    name,
    position: { x, y },
    variables: {
      name,
      addressSpace: "10.0.0.0/16",
    },
  };
}

export default {
  name: "Virtual Network",
  type: "vnet" as ModuleType,
  icon: VNetIcon,
  defaultVariables: {
    name: "vnet-main",
    addressSpace: "10.0.0.0/16",
  },
};
