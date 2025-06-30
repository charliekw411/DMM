import { Module } from "../../components/modules/types";
import { moduleVersions } from "../moduleVersions";

type BicepContext = {
  subnets?: Module[];
  nsgBySubnet?: Record<string, string>;
  dependsOn?: string[];
};

export function generateBicepModule(
  mod: Module,
  scope: string,
  context: BicepContext = {}
): string {
  const nameSafe = mod.name.replace(/[^a-zA-Z0-9]/g, "");
  const dependsOnBlock =
    context.dependsOn && context.dependsOn.length > 0
      ? `\n  dependsOn: [${context.dependsOn.join(", ")}]`
      : "";

  const version = (type: string) =>
    moduleVersions[type] || "0.1.0";

  switch (mod.type) {
        case "vnet": {
      const subnets = (context.subnets ?? []).map((sub) => {
        const nsgName = context.nsgBySubnet?.[sub.id];
        return `{
          name: '${sub.name}'
          addressPrefix: '${sub.variables?.addressPrefix ?? "10.0.1.0/24"}'${
            nsgName
              ? `\n          networkSecurityGroup: {\n            id: resourceId('Microsoft.Network/networkSecurityGroups', '${nsgName}')\n          }`
              : ""
          }
        }`;
      });

      return `module ${nameSafe} 'br/public:avm/res/network/virtual-network:${version(
        "virtual-network"
      )}' = {
  name: '${nameSafe}Deployment'
  scope: ${scope}
  params: {
    name: '${mod.name}'
    location: location
    tags: tags
    addressPrefixes: ['${mod.variables?.addressPrefix ?? "10.0.0.0/16"}']
    subnets: [
      ${subnets.join(",\n      ")}
    ]
  }${dependsOnBlock}
}`;
    }
    case "nsg":
      return `module ${nameSafe} 'br/public:avm/res/network/network-security-group:${version(
        "network-security-group"
      )}' = {
  name: '${nameSafe}Deployment'
  scope: ${scope}
  params: {
    name: '${mod.name}'
    location: location
    tags: tags
  }${dependsOnBlock}
}`;

    case "subnet":
      return `// Subnet ${mod.name} is handled as part of VNet subnets list`;

    case "firewall":
      return `module ${nameSafe} 'br/public:avm/res/network/azure-firewall:${version(
        "firewall"
      )}' = {
  name: '${nameSafe}Deployment'
  scope: ${scope}
  params: {
    name: '${mod.name}'
    location: location
    tags: tags
    properties: {
      sku: {
        name: '${mod.variables?.sku ?? "AZFW_VNet"}'
        tier: '${mod.variables?.tier ?? "Standard"}'
      }
      // Adjust this subnet config if AzureFirewallSubnet not found in canvas
    }
  }${dependsOnBlock}
}`;

    case "routetable":
      return `module ${nameSafe} 'br/public:avm/res/network/route-table:${version(
        "routetable"
      )}' = {
  name: '${nameSafe}Deployment'
  scope: ${scope}
  params: {
    name: '${mod.name}'
    location: location
    tags: tags
    properties: {
      disableBgpRoutePropagation: false
      routes: []
    }
  }${dependsOnBlock}
}`;

    default:
      return `// Unsupported module type: ${mod.type}`;
  }
}
