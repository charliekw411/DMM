import type { ModuleDefinition, Module } from "./types";
import { v4 as uuidv4 } from "uuid";
import subnetWrapper from "./subnet";
import publicip from "./publicip";

const moduleDefinition: ModuleDefinition = {
  type: "firewall",
  name: "Firewall",
  initialVariables: {
    firewallName: "firewall1",
  },
  variableSchema: {
    firewallName: {
      label: "Firewall Name",
      type: "string",
      required: true,
    },
    sku: {
      label: "SKU",
      type: "select",
      required: true,
      options: ["Standard", "Basic"],
    },
  },
  avm: {
    moduleName: "network.azure-firewall",
    versionKey: "firewall",
    outputVars: ["id", "name"],
  },

  createBundle: (x: number, y: number, values: Record<string, string>) => {
    const firewallId = uuidv4();
    const subnetId = uuidv4();
    const pipId = uuidv4();

    const fwName = values.firewallName ?? "firewall1";

    const firewall: Module = {
      id: firewallId,
      type: "firewall",
      name: fwName,
      position: { x, y },
      variables: {
        firewallName: fwName,
      },
    };

    const subnetModule = subnetWrapper .moduleDefinition;
    const subnet: Module = {
      id: subnetId,
      type: "subnet",
      name: "AzureFirewallSubnet",
      position: { x: x - 120, y: y + 120 },
      variables: {
        subnetName: "AzureFirewallSubnet",
        cidr: "10.0.0.0/26",
      },
    };

    const publicipModule = publicip.moduleDefinition;
    const publicIp: Module = {
      id: pipId,
      type: "publicip",
      name: `${fwName}-pip`,
      position: { x: x + 120, y: y + 120 },
      variables: {
        publicIpName: `${fwName}-pip`,
        sku: "Standard",
        allocationMethod: "Static",
      },
    };

    return {
      modules: [firewall, subnet, publicIp],
      connections: [
        { from: subnetId, to: firewallId, type: "dependency" },
        { from: pipId, to: firewallId, type: "dependency" },
      ],
    };
  },
};

export default { moduleDefinition };
