// src/components/modules/firewall.ts
import { FirewallIcon } from "./icons";
import { Module, ModuleType } from "./types";
import { v4 as uuidv4 } from "uuid";

export function createFirewall(name: string, x: number, y: number): Module {
  return {
    id: uuidv4(),
    type: "firewall",
    name,
    position: { x, y },
    variables: {
      name,
      addressPrefix: "10.0.2.0/24", // must match AzureFirewallSubnet name
    },
  };
}

export default {
  name: "Azure Firewall",
  type: "firewall" as ModuleType,
  icon: FirewallIcon,
  defaultVariables: {
    name: "fw-main",
    addressPrefix: "10.0.2.0/24",
  },
};
