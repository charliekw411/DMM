// src/components/modules/subnet.ts
import { SubnetIcon } from "./icons";
import { Module, ModuleType } from "./types";
import { v4 as uuidv4 } from "uuid";

export function createSubnet(name: string, parentId: string, x: number, y: number): Module {
  return {
    id: uuidv4(),
    type: "subnet",
    name,
    position: { x, y },
    parentId,
    variables: {
      name,
      addressPrefix: "10.0.1.0/24",
    },
  };
}

export default {
  name: "Subnet",
  type: "subnet" as ModuleType,
  icon: SubnetIcon,
  defaultVariables: {
    name: "subnet-app",
    addressPrefix: "10.0.1.0/24",
  },
};
