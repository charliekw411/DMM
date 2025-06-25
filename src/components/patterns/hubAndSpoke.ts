// src/components/patterns/hubAndSpoke.ts
import { createResourceGroup } from "../modules/resourcegroup";
import { createVNet } from "../modules/vnet";
import { createSubnet } from "../modules/subnet";
import { createNSG } from "../modules/nsg";
import { createFirewall } from "../modules/firewall";
import { createRouteTable } from "../modules/routetable";
import { Module } from "../modules/types";
import createSpokePattern from "./spoke";

export const name = "Hub & Spoke Network";
export const type = "hubAndSpoke";

export const inputs = ["name"];

export function create(values: Record<string, string>): Module[] {
  const modules: Module[] = [];
  const startX = 200;
  const startY = 200;

  // Hub RG
  const hubRG = createResourceGroup(`${values.name}-hub-rg`, startX, startY);
  modules.push(hubRG);

  // Hub VNet
  const hubVNet = createVNet(`${values.name}-hub-vnet`, startX + 40, startY + 40);
  hubVNet.resourceGroup = hubRG.id;
  modules.push(hubVNet);

  // Hub Subnet
  const hubSubnet = createSubnet(`${values.name}-subnet`, hubVNet.id, startX + 140, startY + 100);
  hubSubnet.resourceGroup = hubRG.id;
  modules.push(hubSubnet);

  // NSG
  const hubNSG = createNSG(`${values.name}-nsg`, startX + 60, startY + 160);
  hubNSG.resourceGroup = hubRG.id;
  modules.push(hubNSG);

  // Firewall
  const firewall = createFirewall(`${values.name}-fw`, startX + 200, startY + 80);
  firewall.resourceGroup = hubRG.id;
  modules.push(firewall);

  // Route Table
  const routeTable = createRouteTable(`${values.name}-rt`, startX + 100, startY + 220);
  routeTable.resourceGroup = hubRG.id;
  modules.push(routeTable);

  // Spoke pattern (embedded)
  const spokeModules = createSpokePattern.create({
    name: `${values.name}-spoke`,
  });

  modules.push(...spokeModules);

  return modules;
}

export default {
  name,
  type,
  inputs,
  create,
};
