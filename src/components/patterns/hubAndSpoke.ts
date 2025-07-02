// src/components/patterns/hubAndSpoke.ts
import { v4 as uuid } from "uuid";
import type { PatternModule } from "./types";
import type { Module, Connection } from "../modules/types";
import { validateCidr, getAutoName, getDefaultCidr } from "../modules/utils";

const hubAndSpoke: PatternModule = {
  name: "Hub & Spoke",
  type: "hubandspoke",
  description: "Deploys a hub VNet with firewall and NSG, peered with a spoke VNet and its own NSG.",
  initialVariables: {
    hubName: "hub-vnet",
    spokeName: "spoke-vnet",
    hubCidr: "10.0.0.0/16",
    spokeCidr: "10.1.0.0/16",
  },
  variableSchema: {
    hubName: { label: "Hub VNet Name", type: "string", required: true },
    spokeName: { label: "Spoke VNet Name", type: "string", required: true },
    hubCidr: {
      label: "Hub CIDR",
      type: "string",
      required: true,
      validate: validateCidr,
    },
    spokeCidr: {
      label: "Spoke CIDR",
      type: "string",
      required: true,
      validate: validateCidr,
    },
  },
  create: (values): { modules: Module[]; connections: Connection[] } => {
    const modules: Module[] = [];

    const hubRg: Module = {
      id: uuid(),
      type: "resourcegroup",
      name: "hub-rg",
      position: { x: 100, y: 100 },
      variables: { resourceGroupName: "hub-rg" },
      width: 300,
      height: 260,
    };

    const spokeRg: Module = {
      id: uuid(),
      type: "resourcegroup",
      name: "spoke-rg",
      position: { x: 500, y: 100 },
      variables: { resourceGroupName: "spoke-rg" },
      width: 300,
      height: 260,
    };

    const hubVnetName = getAutoName("vnet", modules);
    const hubVnet: Module = {
      id: uuid(),
      type: "vnet",
      name: hubVnetName,
      position: { x: 20, y: 40 },
      resourcegroup: hubRg.id,
      variables: {
        vnetName: values.hubName || hubVnetName,
        cidr:
          values.hubCidr ||
          getDefaultCidr("vnet", modules.filter((m) => m.type === "vnet").length),
      },
    };

    const spokeVnetName = getAutoName("vnet", [...modules, hubVnet]);
    const spokeVnet: Module = {
      id: uuid(),
      type: "vnet",
      name: spokeVnetName,
      position: { x: 20, y: 40 },
      resourcegroup: spokeRg.id,
      variables: {
        vnetName: values.spokeName || spokeVnetName,
        cidr:
          values.spokeCidr ||
          getDefaultCidr("vnet", [...modules, hubVnet].filter((m) => m.type === "vnet").length),
      },
    };

    const hubSubnetName = getAutoName("subnet", modules);
    const hubSubnet: Module = {
      id: uuid(),
      type: "subnet",
      name: hubSubnetName,
      position: { x: 180, y: 40 },
      resourcegroup: hubRg.id,
      variables: {
        subnetName: hubSubnetName,
        cidr: getDefaultCidr("subnet", modules.filter((m) => m.type === "subnet").length),
      },
    };

    const fwSubnetName = "AzureFirewallSubnet";
    const fwSubnet: Module = {
      id: uuid(),
      type: "subnet",
      name: fwSubnetName,
      position: { x: 240, y: 120 },
      resourcegroup: hubRg.id,
      variables: {
        subnetName: fwSubnetName,
        cidr: getDefaultCidr("subnet", [...modules, hubSubnet].filter((m) => m.type === "subnet").length),
      },
    };

    const spokeSubnetName = getAutoName("subnet", [...modules, hubSubnet, fwSubnet]);
    const spokeSubnet: Module = {
      id: uuid(),
      type: "subnet",
      name: spokeSubnetName,
      position: { x: 180, y: 40 },
      resourcegroup: spokeRg.id,
      variables: {
        subnetName: spokeSubnetName,
        cidr: getDefaultCidr("subnet", [...modules, hubSubnet, fwSubnet].filter((m) => m.type === "subnet").length),
      },
    };

    const hubNsg: Module = {
      id: uuid(),
      type: "nsg",
      name: "hub-nsg",
      position: { x: 180, y: 120 },
      resourcegroup: hubRg.id,
      variables: {
        nsgName: "hub-nsg",
      },
    };

    const spokeNsg: Module = {
      id: uuid(),
      type: "nsg",
      name: "spoke-nsg",
      position: { x: 180, y: 120 },
      resourcegroup: spokeRg.id,
      variables: {
        nsgName: "spoke-nsg",
      },
    };

    const firewall: Module = {
      id: uuid(),
      type: "firewall",
      name: "hub-fw",
      position: { x: 60, y: 120 },
      resourcegroup: hubRg.id,
      variables: {
        firewallName: "hub-fw",
        vnetName: values.hubName || hubVnetName,
        vnetResourceGroup: "hub-rg",
      },
    };

    const publicIp: Module = {
      id: uuid(),
      type: "publicip",
      name: "hub-fw-ip",
      position: { x: 60, y: 180 },
      resourcegroup: hubRg.id,
      variables: { 
        publicIpName: "hub-fw-ip",
        sku: "Standard",
        allocationMethod: "Static",
      },
    };

    modules.push(
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
      publicIp 
    );

    const connections: Connection[] = [
      { from: hubSubnet.id, to: hubVnet.id, type: "subnet-association" },
      { from: hubSubnet.id, to: hubNsg.id, type: "dependency" },
      { from: fwSubnet.id, to: hubVnet.id, type: "subnet-association" },
      { from: firewall.id, to: fwSubnet.id, type: "dependency" },
      { from: spokeSubnet.id, to: spokeVnet.id, type: "subnet-association" },
      { from: spokeSubnet.id, to: spokeNsg.id, type: "dependency" },
      { from: spokeVnet.id, to: hubVnet.id, type: "peering" },
      { from: publicIp.id, to: firewall.id, type: "dependency" },
    ];

    return { modules, connections };
  },
};

export default hubAndSpoke;
export const createHubAndSpokePattern = hubAndSpoke.create;
export const initialValues = hubAndSpoke.initialVariables;
