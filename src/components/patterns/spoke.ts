// src/components/patterns/spoke.ts
import { createVNet } from "../modules/vnet";
import { createSubnet } from "../modules/subnet";
import { createNSG } from "../modules/nsg";
import { createResourceGroup } from "../modules/resourcegroup";
import { Module } from "../modules/types";

export const name = "Spoke Network";
export const type = "spoke";

export const inputs = ["name"]; // expected from user on add

export function create(values: Record<string, string>): Module[] {
  const modules: Module[] = [];

  const startX = 200;
  const startY = 200;

  // 1. Resource Group
  const rg = createResourceGroup(`${values.name}-rg`, startX, startY);
  modules.push(rg);

  // 2. VNet
  const vnet = createVNet(`${values.name}-vnet`, startX + 40, startY + 40);
  vnet.resourceGroup = rg.id;
  modules.push(vnet);

  // 3. Subnet
  const subnet = createSubnet(`${values.name}-subnet`, vnet.id, startX + 120, startY + 120);
  subnet.resourceGroup = rg.id;
  modules.push(subnet);

  // 4. NSG
  const nsg = createNSG(`${values.name}-nsg`, startX + 80, startY + 180);
  nsg.resourceGroup = rg.id;
  modules.push(nsg);

  return modules;
}

export default {
  name,
  type,
  inputs,
  description: "Creates a VNet, Subnet, and NSG inside a Resource Group.",
  create,
};
