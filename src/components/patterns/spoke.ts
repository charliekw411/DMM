// src/components/patterns/spoke.ts
import { createModule } from "../modules/utils";
import { Module } from "../modules/types";

export const name = "Spoke Network";
export const type = "spoke";
export const inputs = ["name"];

export function create(values: Record<string, string>): {
  modules: Module[];
  connections: { from: string; to: string; type: "subnet-association" | "dependency" }[];
} {
  const modules: Module[] = [];
  const connections: { from: string; to: string; type: "subnet-association" | "dependency" }[] = [];

  const startX = 200;
  const startY = 200;

  // Resource Group
  const rg = createResourceGroup(`${values.name}-rg`, startX, startY);
  modules.push(rg);

  // VNet
  const vnet = createVNet(`${values.name}-vnet`, startX + 40, startY + 40);
  vnet.resourceGroup = rg.id;
  modules.push(vnet);

  // Subnet
  const subnet = createSubnet(`${values.name}-subnet`, vnet.id, startX + 120, startY + 120);
  subnet.resourceGroup = rg.id;
  modules.push(subnet);

  // NSG
  const nsg = createNSG(`${values.name}-nsg`, startX + 80, startY + 180);
  nsg.resourceGroup = rg.id;
  modules.push(nsg);

  // Connections
  connections.push(
    { from: subnet.id, to: vnet.id, type: "subnet-association" },
    { from: subnet.id, to: nsg.id, type: "dependency" }
  );

  return { modules, connections };
}

export default {
  name,
  type,
  inputs,
  description: "Creates a VNet, Subnet, and NSG inside a Resource Group.",
  create,
};
