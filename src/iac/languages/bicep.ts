import { Module } from "../../components/modules/types";

export function generateBicepModule(
  mod: Module,
  context: {
    subnets?: Module[];
    nsgBySubnet?: Record<string, string>;
  }
): string {
  const { variables } = mod;

  if (mod.type === "vnet") {
    const subnets = context.subnets ?? [];
    const subnetBlocks = subnets
      .map((subnet) => {
        const subnetName = subnet.variables?.subnetName || subnet.name;
        const addressPrefix = subnet.variables?.addressPrefix || "10.0.1.0/24";
        const nsgId = context.nsgBySubnet?.[subnet.id];
        

        const nsgRef = nsgId
          ? `
            networkSecurityGroup: {
              id: resourceId('Microsoft.Network/networkSecurityGroups', '${nsgId}')
            }`
          : "";

        return `{
          name: '${subnetName}'
          properties: {
            addressPrefix: '${addressPrefix}'${nsgRef}
          }
        }`;
      })
      .join(",\n");

    const vnetName = variables?.vnetName || mod.name;
    const addressSpace = variables?.addressSpace || "10.0.0.0/16";
    
    return `resource ${vnetName} 'Microsoft.Network/virtualNetworks@2020-11-01' = {
    name: '${vnetName}'
    location: resourceGroup().location
    properties: {
      addressSpace: {
        addressPrefixes: [
          '${addressSpace}'
        ]
    }
    subnets: [
      ${subnetBlocks}
    ]
  }
}

`;
  }

  if (mod.type === "nsg") {
    const nsgName = variables?.nsgName || mod.name;
    return `resource ${nsgName} 'Microsoft.Network/networkSecurityGroups@2020-11-01' = {
  name: '${nsgName}'
  location: resourceGroup().location
  properties: {}
}

`;
  }

  if (mod.type === "subnet") {
    // Shouldn't reach here — subnets are included in vnet blocks
    return "";
  }

  if (mod.type === "firewall") {
    const fwName = variables?.firewallName || mod.name;
    return `resource ${fwName} 'Microsoft.Network/azureFirewalls@2020-11-01' = {
  name: '${fwName}'
  location: resourceGroup().location
  properties: {
    sku: {
      name: 'AZFW_VNet'
      tier: 'Standard'
    },
    ipConfigurations: []
  }
}

`;
  }

  return `// Unknown module type: ${mod.type}\n`;
}
