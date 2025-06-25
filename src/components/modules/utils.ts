import { Module } from "./types";

// Generic module factory
export const createModule = (
  type: Module["type"],
  name: string,
  parentId?: string,
  x: number = 100,
  y: number = 100,
  variables?: Record<string, any>,
  resourceGroupId?: string
): Module => ({
  id: crypto.randomUUID(),
  type,
  name,
  position: { x, y },
  parentId,
  variables,
  resourceGroupId,
});

// VNet
export const createVNet = (
  name: string,
  resourceGroupId: string,
  addressSpace: string,
  x = 100,
  y = 100
): Module =>
  createModule("vnet", name, undefined, x, y, { addressSpace }, resourceGroupId);

// Subnet
export const createSubnet = (
  name: string,
  parentVnetId: string,
  cidr: string,
  resourceGroupId: string,
  x?: number,
  y?: number
): Module =>
  createModule("subnet", name, parentVnetId, x, y, { cidr }, resourceGroupId);

// NSG
export const createNSG = (
  name: string,
  resourceGroupId: string,
  x = 160,
  y = 160
): Module =>
  createModule("nsg", name, undefined, x, y, {}, resourceGroupId);

// Firewall + AzureFirewallSubnet
export const createFirewall = (
  name: string,
  parentVnetId: string,
  resourceGroupId: string,
  x = 180,
  y = 180
): Module[] => {
  const firewall = createModule("firewall", name, parentVnetId, x, y, {}, resourceGroupId);

  const firewallSubnet = createSubnet(
    "AzureFirewallSubnet",
    parentVnetId,
    "10.0.255.0/26", // standard reserved range
    resourceGroupId,
    x + 40,
    y + 60
  );

  return [firewall, firewallSubnet];
};

// Route Table
export const createRouteTable = (
  name: string,
  resourceGroupId: string,
  x = 200,
  y = 200
): Module =>
  createModule("routeTable", name, undefined, x, y, {}, resourceGroupId);
