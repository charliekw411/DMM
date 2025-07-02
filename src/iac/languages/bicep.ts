import { AppConfig } from "../../components/context/appContext";
import { moduleVersions } from "../moduleVersions";
import { Module } from "../../components/modules/types";

// Helper to get best-match CIDR
const getCidr = (mod: Module): string =>
  mod.variables?.cidr ?? mod.variables?.addressPrefix ?? mod.variables?.addressSpace ?? "10.0.0.0/16";

export function generateBicep(config: AppConfig): string {
  const rgModules = config.modules.filter((m) => m.type === "resourcegroup");

  const rgNames = Object.fromEntries(
    rgModules.map((rg) => [rg.id, rg.variables.resourceGroupName])
  );

  const getScope = (mod: Module) => {
    const rgKey = mod.resourcegroup;
    const rgName = rgKey && rgNames[rgKey] ? rgNames[rgKey] : "unknown-rg";
    return `resourceGroup('${rgName}')`;
  };

  const getDependsOn = (mod: Module) => {
    const depends = config.connections
      ?.filter((c) => c.from === mod.id)
      .map((c) => config.modules.find((m) => m.id === c.to)?.name)
      .filter(Boolean);
    return depends && depends.length > 0 ? `\n  dependsOn: [${depends.map((d) => `${d}Deployment`).join(", ")}]` : "";
  };

  const getConnectedNsg = (subnetId: string): string | null => {
    const conn = config.connections.find((c) => c.from === subnetId && c.type === "dependency");
    const nsg = conn ? config.modules.find((m) => m.id === conn.to && m.type === "nsg") : null;
    return nsg?.variables?.nsgName ?? null;
  };

  const getSubnetsForVnet = (vnetId: string) => {
    return config.connections
      .filter((c) => c.to === vnetId && c.type === "subnet-association")
      .map((c) => config.modules.find((m) => m.id === c.from))
      .filter((m): m is Module => !!m);
  };

  const renderModule = (mod: Module): string => {
    const version = moduleVersions[mod.type] ?? "0.4.0";

    switch (mod.type) {
      case "resourcegroup":
        return `
module ${mod.name}Deployment 'br/public:avm/res/resources/resource-group:${version}' = {
  name: '${mod.name}Deployment'
  scope: subscription()
  params: {
    name: '${mod.variables.resourceGroupName}'
    location: location
    tags: tags
  }
}
        `.trim();

      case "vnet": {
        const subnets = getSubnetsForVnet(mod.id);
        const subnetBlocks = subnets.map((sub) => {
          const nsgId = getConnectedNsg(sub.id);
          const nsgBlock = nsgId
            ? `
          networkSecurityGroup: {
            id: resourceId('Microsoft.Network/networkSecurityGroups', '${nsgId}')
          }`
            : "";
          return `{
          name: '${sub.variables.subnetName}'
          addressPrefix: '${getCidr(sub)}'${nsgBlock}
        }`;
        });

        return `
module ${mod.name}Deployment 'br/public:avm/res/network/virtual-network:${version}' = {
  name: '${mod.name}Deployment'
  scope: ${getScope(mod)}
  params: {
    name: '${mod.variables.vnetName}'
    location: location
    tags: tags
    addressPrefixes: ['${getCidr(mod)}']
    subnets: [
${subnetBlocks.join(",\n")}
    ]
  }${getDependsOn(mod)}
}
        `.trim();
      }

      case "subnet":
        return `// Subnet ${mod.name} is handled as part of VNet subnets list`;

      case "nsg":
        return `
module ${mod.name}Deployment 'br/public:avm/res/network/network-security-group:${version}' = {
  name: '${mod.name}Deployment'
  scope: ${getScope(mod)}
  params: {
    name: '${mod.variables.nsgName}'
    location: location
    tags: tags
  }${getDependsOn(mod)}
}
        `.trim();

      case "publicip":
        return `
module ${mod.name}Deployment 'br/public:avm/res/network/public-ip:${version}' = {
  name: '${mod.name}Deployment'
  scope: ${getScope(mod)}
  params: {
    name: '${mod.variables.publicIpName}'
    location: location
    allocationMethod: '${mod.variables.allocationMethod ?? "Static"}'
    sku: '${mod.variables.sku ?? "Standard"}'
    tags: tags
  }${getDependsOn(mod)}
}
        `.trim();

      case "firewall":
        return `
module ${mod.name}Deployment 'br/public:avm/res/network/azure-firewall:${version}' = {
  name: '${mod.name}Deployment'
  scope: ${getScope(mod)}
  params: {
    name: '${mod.variables.firewallName}'
    location: location
    azureSkuTier: 'Standard'
    tags: tags
  }${getDependsOn(mod)}
}
        `.trim();

      case "routetable":
        return `
module ${mod.name}Deployment 'br/public:avm/res/network/route-table:${version}' = {
  name: '${mod.name}Deployment'
  scope: ${getScope(mod)}
  params: {
    name: '${mod.variables.routeTableName}'
    location: location
    tags: tags
  }${getDependsOn(mod)}
}
        `.trim();

      default:
        return `// Unsupported module type: ${mod.type}`;
    }
  };

  const preamble = `targetScope = 'subscription'

@description('Deployment location')
param location string = 'australiaeast'

@description('Environment')
param environment string = ''

@description('Tags to apply to resources')
param tags object = {
  // no tags
}`;

  const rendered = config.modules.map(renderModule).join("\n\n");

  return `${preamble}\n\n${rendered}`.trim();
}
