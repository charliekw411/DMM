import { Module } from "../modules/types";

export function createHubAndSpokePattern(): Module[] {
  return [
    {
      id: "vnet-hub-001",
      type: "vnet",
      name: "hub-vnet",
      position: { x: 100, y: 100 }
    },
    {
      id: "subnet-hub-001",
      type: "subnet",
      name: "AzureFirewallSubnet",
      parentId: "vnet-hub-001",
      position: { x: 130, y: 160 }
    },
    {
      id: "firewall-001",
      type: "firewall",
      name: "az-fw",
      parentId: "vnet-hub-001",
      position: { x: 200, y: 180 }
    }
  ];
}
