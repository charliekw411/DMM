// src/components/modules/routetable.ts
import { RouteTableIcon } from "./icons";
import { Module, ModuleType } from "./types";
import { v4 as uuidv4 } from "uuid";

export function createRouteTable(name: string, x: number, y: number): Module {
  return {
    id: uuidv4(),
    type: "routeTable",
    name,
    position: { x, y },
    variables: {
      name,
    },
  };
}

export default {
  name: "Route Table",
  type: "routeTable" as ModuleType,
  icon: RouteTableIcon,
  defaultVariables: {
    name: "rt-main",
  },
};
