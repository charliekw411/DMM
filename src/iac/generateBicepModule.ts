import { Module } from "../components/modules/types";
import { moduleVersions } from "./moduleVersions";
import { moduleAvmMappings } from "./moduleAvmMappings";

type BicepContext = {
  scope: string;
  subnets?: Module[];
  nsgBySubnet?: Record<string, string>;
  dependsOn?: string[];
};

const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9]/g, "");
const getCidr = (mod: Module): string =>
  mod.variables?.cidr ||
  mod.variables?.addressPrefix ||
  mod.variables?.addressSpace ||
  "10.0.0.0/24";

export function generateBicepModule(mod: Module, ctx: BicepContext): string {
  const { scope, subnets = [], nsgBySubnet = {}, dependsOn = [] } = ctx;

  const depBlock = dependsOn.length
    ? `  dependsOn: [${dependsOn.join(", ")}]
`
    : "";

  const tagsBlock = `    tags: tags`;
  const loc = `    location: location`;
  const deploymentName = sanitize(mod.name) + "Deployment";

  const mapping = moduleAvmMappings[mod.type];
  const versionKey = mapping?.versionKey;
  const avmPath = mapping?.path;

  const version = versionKey && moduleVersions[versionKey] ? moduleVersions[versionKey] : "1.0.0";

  if (!avmPath) {
    console.warn(`No AVM path found for type: ${mod.type}`);
    return `// ERROR: No AVM mapping for module type: ${mod.type}`;
  }

  switch (mod.type) {
    case "vnet": {
      const subnetStrings = subnets.map((sub, index) => {
        const cidr = getCidr(sub);
        const nsg = nsgBySubnet[sub.id];

        const properties = [
          `name: '${sub.variables?.subnetName ?? sub.name}'`,
          `addressPrefix: '${cidr}'`,
        ];

        if (nsg) {
          properties.push(`networkSecurityGroup: {
            id: resourceId('Microsoft.Network/networkSecurityGroups', '${nsg}')
          }`);
        }

        return `      {
        ${properties.join("\n        ")}
      }`;
      });

      return `module ${deploymentName} 'br/public:${avmPath}:${version}' = {
  name: '${deploymentName}'
  scope: ${scope}
  params: {
    name: '${mod.name}'
${loc}
${tagsBlock}
    addressPrefixes: ['${getCidr(mod)}']
    subnets: [
${subnetStrings.join("\n")}
    ]
  }
${depBlock}}`;
    }

    case "subnet":
      return `// Subnet ${mod.name} is handled as part of VNet subnets list`;

    case "nsg":
      return `module ${deploymentName} 'br/public:${avmPath}:${version}' = {
  name: '${deploymentName}'
  scope: ${scope}
  params: {
    name: '${mod.name}'
${loc}
${tagsBlock}
  }
${depBlock}}`;

  case "firewall": {
    const publicIpIds: string[] = mod.variables?.publicIpIds ?? [];
    const publicIp = publicIpIds.length > 0 ? publicIpIds[0] : null;

    const vnetLogicalName = mod.variables?.vnetName;
    const vnetRg = mod.variables?.vnetResourceGroup;
    const vnetDeploymentName = vnetLogicalName ? sanitize(vnetLogicalName) + "Deployment" : null;

    if (!vnetLogicalName || !vnetRg || !vnetDeploymentName) {
      return `// ERROR: Missing vnetName or vnetResourceGroup for firewall module '${mod.name}'`;
    }

    const fullDependsOn = [...dependsOn];
    fullDependsOn.push(vnetDeploymentName);
    const depBlock = fullDependsOn.length
      ? `  dependsOn: [${fullDependsOn.join(", ")}]
  `
      : "";

    return `module ${deploymentName} 'br/public:${avmPath}:${version}' = {
    name: '${deploymentName}'
    scope: ${scope}
    params: {
      name: '${mod.name}'
  ${loc}
      azureSkuTier: '${mod.variables?.skuTier || "Standard"}'${publicIp ? `
      publicIPResourceID: ${publicIp}` : ""}
      virtualNetworkResourceId: ${vnetDeploymentName}.outputs.resourceId
  ${tagsBlock}
    }
  ${depBlock}}`;
  }


    case "publicip":
      return `module ${deploymentName} 'br/public:${avmPath}:${version}' = {
  name: '${deploymentName}'
  scope: ${scope}
  params: {
    name: '${mod.name}'
${loc}
    skuName: '${mod.variables?.skuName || "Standard"}'
    publicIPAllocationMethod: '${mod.variables?.allocationMethod || "Static"}'
    publicIPAddressVersion: '${mod.variables?.ipVersion || "IPv4"}'
${tagsBlock}
  }
${depBlock}}`;

    default:
      return `// Unsupported module type: ${mod.type}`;
  }
}
