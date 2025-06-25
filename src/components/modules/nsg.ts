// src/components/modules/nsg.ts
import { NSGIcon } from "./icons";
import { Module, ModuleType } from "./types";
import { v4 as uuidv4 } from "uuid";

export function createNSG(name: string, x: number, y: number): Module {
  return {
    id: uuidv4(),
    type: "nsg",
    name,
    position: { x, y },
    variables: {
      name,
    },
  };
}

export default {
  name: "Network Security Group",
  type: "nsg" as ModuleType,
  icon: NSGIcon,
  defaultVariables: {
    name: "nsg-main",
  },
};
