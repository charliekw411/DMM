// src/iac/exporter.ts
import { AppConfig, Connection } from "../components/context/appContext";
import { generateBicepModule } from "./languages/bicep";
import { Module } from "../components/modules/types";
import { moduleVersions } from "./moduleVersions";

type GroupedModules = Record<string, Module[]>;

function groupModulesByRG(modules: Module[]): GroupedModules {
  const groups: GroupedModules = {};
  for (const mod of modules) {
    const rg = mod.resourcegroup ?? "default";
    if (!groups[rg]) groups[rg] = [];
    groups[rg].push(mod);
  }
  return groups;
}

function getSubnetsByVnet(modules: Module[], connections: Connection[]) {
  const subnetsByVnet: Record<string, Module[]> = {};
  for (const conn of connections) {
    const from = modules.find((m) => m.id === conn.from);
    const to = modules.find((m) => m.id === conn.to);
    if (!from || !to) continue;

    if (conn.type === "subnet-association") {
      const subnet = from.type === "subnet" ? from : to;
      const vnet = from.type === "vnet" ? from : to;
      if (!subnetsByVnet[vnet.name]) subnetsByVnet[vnet.name] = [];
      subnetsByVnet[vnet.name].push(subnet);
    }
  }
  return subnetsByVnet;
}

function getNSGLinks(modules: Module[], connections: Connection[]) {
  const nsgMap: Record<string, string> = {};
  for (const conn of connections) {
    const from = modules.find((m) => m.id === conn.from);
    const to = modules.find((m) => m.id === conn.to);
    if (!from || !to) continue;

    if (
      conn.type === "dependency" &&
      ((from.type === "subnet" && to.type === "nsg") ||
        (from.type === "nsg" && to.type === "subnet"))
    ) {
      const subnet = from.type === "subnet" ? from : to;
      const nsg = from.type === "nsg" ? from : to;
      nsgMap[subnet.id] = nsg.name;
    }
  }
  return nsgMap;
}
export function exportToBicep(config: AppConfig): string {
  const { modules, connections, project } = config;

  const resourceGroups = modules.filter((m) => m.type === "resourcegroup");
  const groupedModules = groupModulesByRG(modules);
  const subnetsByVnet = getSubnetsByVnet(modules, connections);
  const nsgLinks = getNSGLinks(modules, connections);

  const tagsBlock =
    (project?.tags ?? []).length > 0
      ? (project?.tags ?? [])
          .filter((tag) => tag.name && tag.value)
          .map((tag) => `  '${tag.name}': '${tag.value}'`)
          .join("\n")
      : "";

  const paramBlock = `
targetScope = 'subscription'

@description('Deployment location')
param location string = '${project?.location ?? "australiaeast"}'

@description('Environment')
param environment string = '${project?.environment ?? "dev"}'

@description('Tags to apply to resources')
param tags object = {
${tagsBlock || "  // no tags"}
}
`;

  const rgResources = resourceGroups
    .map((rg) => {
      const deploymentName = rg.name.replace(/[^a-zA-Z0-9]/g, "") + "Deployment";
      const version = moduleVersions["resource-group"] ?? "0.4.1";
      return `module ${deploymentName} 'br/public:avm/res/resources/resource-group:${version}' = {
  name: '${deploymentName}'
  scope: subscription()
  params: {
    name: '${rg.name}'
    location: location
    tags: tags
  }
}`;
    })
    .join("\n\n");

  const moduleResources = Object.entries(groupedModules)
  .filter(([rg]) => rg !== "default")
  .flatMap(([rgId, mods]) => {
    const rg = resourceGroups.find((r) => r.id === rgId);
    if (!rg) return [];

    const rgDeploymentName = rg.name.replace(/[^a-zA-Z0-9]/g, "") + "Deployment";

    return mods
      .filter((m) => m.type !== "resourcegroup")
      .map((mod) =>
        generateBicepModule(mod, `resourceGroup('${rg.name}')`, {
          subnets: subnetsByVnet[mod.name],
          nsgBySubnet: nsgLinks,
          dependsOn: [rgDeploymentName],
        })
      );
  })
  .join("\n\n");
  return [paramBlock.trim(), rgResources, moduleResources].join("\n\n");
}
