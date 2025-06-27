import { Module } from "../modules/types";
import { v4 as uuid } from "uuid";

export const hubAndSpoke = {
  name: "Hub & Spoke",
  description: "Deploys a hub VNet with firewall and NSG, peered with a spoke VNet and its own NSG.",
  create: (): {
    modules: Module[];
    connections: {
      from: string;
      to: string;
      type: "subnet-association" | "dependency" | "peering";
    }[];
  } => {
    // 🔷 Resource Groups
    const hubRg: Module = {
      id: uuid(),
      type: "resourceGroup",
      name: "hub-rg",
      position: { x: 100, y: 100 },
      variables: { resourceGroupName: "hub-rg" },
      width: 300,
      height: 260,
    };

    const spokeRg: Module = {
      id: uuid(),
      type: "resourceGroup",
      name: "spoke-rg",
      position: { x: 500, y: 100 },
      variables: { resourceGroupName: "spoke-rg" },
      width: 300,
      height: 260,
    };

    // 🔷 VNets
    const hubVnet: Module = {
      id: uuid(),
      type: "vnet",
      name: "hub-vnet",
      position: { x: 20, y: 40 },
      resourceGroup: hubRg.id,
      variables: {
        vnetName: "hub-vnet",
        addressSpace: "10.0.0.0/16",
      },
    };

    const spokeVnet: Module = {
      id: uuid(),
      type: "vnet",
      name: "spoke-vnet",
      position: { x: 20, y: 40 },
      resourceGroup: spokeRg.id,
      variables: {
        vnetName: "spoke-vnet",
        addressSpace: "10.1.0.0/16",
      },
    };

    // 🔷 Subnets
    const hubSubnet: Module = {
      id: uuid(),
      type: "subnet",
      name: "hub-subnet",
      position: { x: 180, y: 40 },
      resourceGroup: hubRg.id,
      variables: {
        subnetName: "hub-subnet",
        addressPrefix: "10.0.1.0/24",
      },
    };

    const fwSubnet: Module = {
      id: uuid(),
      type: "subnet",
      name: "AzureFirewallSubnet",
      position: { x: 240, y: 120 },
      resourceGroup: hubRg.id,
      variables: {
        subnetName: "AzureFirewallSubnet",
        addressPrefix: "10.0.2.0/24",
      },
    };

    const spokeSubnet: Module = {
      id: uuid(),
      type: "subnet",
      name: "spoke-subnet",
      position: { x: 180, y: 40 },
      resourceGroup: spokeRg.id,
      variables: {
        subnetName: "spoke-subnet",
        addressPrefix: "10.1.1.0/24",
      },
    };

    // 🔷 NSGs
    const hubNsg: Module = {
      id: uuid(),
      type: "nsg",
      name: "hub-nsg",
      position: { x: 180, y: 120 },
      resourceGroup: hubRg.id,
      variables: {
        nsgName: "hub-nsg",
      },
    };

    const spokeNsg: Module = {
      id: uuid(),
      type: "nsg",
      name: "spoke-nsg",
      position: { x: 180, y: 120 },
      resourceGroup: spokeRg.id,
      variables: {
        nsgName: "spoke-nsg",
      },
    };

    // 🔷 Firewall
    const firewall: Module = {
      id: uuid(),
      type: "firewall",
      name: "hub-fw",
      position: { x: 60, y: 120 },
      resourceGroup: hubRg.id,
      variables: {
        firewallName: "hub-fw",
      },
    };

    // 🔷 All Modules
    const modules: Module[] = [
      hubRg,
      spokeRg,
      hubVnet,
      spokeVnet,
      hubSubnet,
      spokeSubnet,
      fwSubnet,
      hubNsg,
      spokeNsg,
      firewall,
    ];

    // 🔷 Typed Connections
    const connections: {
      from: string;
      to: string;
      type: "subnet-association" | "dependency" | "peering";
    }[] = [
      { from: hubSubnet.id, to: hubVnet.id, type: "subnet-association" },
      { from: hubSubnet.id, to: hubNsg.id, type: "dependency" },
      { from: fwSubnet.id, to: hubVnet.id, type: "subnet-association" },
      { from: firewall.id, to: fwSubnet.id, type: "dependency" },
      { from: spokeSubnet.id, to: spokeVnet.id, type: "subnet-association" },
      { from: spokeSubnet.id, to: spokeNsg.id, type: "dependency" },
      { from: spokeVnet.id, to: hubVnet.id, type: "peering" },
    ];

    return { modules, connections };
  },
};

export default hubAndSpoke;
