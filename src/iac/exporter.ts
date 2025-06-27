import { AppConfig } from "../components/context/appContext";
import { Module } from "../components/modules/types";
import { generateBicepModule } from "./languages/bicep";

export function exportToBicep(config: AppConfig): string {
  const { modules, connections } = config;

  const subnetsByVNet: Record<string, Module[]> = {};
  const nsgBySubnet: Record<string, string> = {};

  for (const conn of connections) {
    const from = modules.find((m) => m.id === conn.from);
    const to = modules.find((m) => m.id === conn.to);

    if (!from || !to) continue;

    if (conn.type === "subnet-association") {
      // subnet ➝ vnet
      const subnet = from.type === "subnet" ? from : to;
      const vnet = from.type === "vnet" ? from : to;
      if (!subnetsByVNet[vnet.id]) subnetsByVNet[vnet.id] = [];
      subnetsByVNet[vnet.id].push(subnet);
    }

    if (conn.type === "dependency") {
      // subnet ➝ nsg
      const subnet = from.type === "subnet" ? from : to;
      const nsg = from.type === "nsg" ? from : to;
      nsgBySubnet[subnet.id] = nsg.id;
    }
  }

  let bicepCode = "";

  for (const mod of modules) {
    if (mod.type === "vnet") {
      const subnets = subnetsByVNet[mod.id] || [];
      bicepCode += generateBicepModule(mod, { subnets, nsgBySubnet });
    } else if (mod.type === "subnet") {
      // skip — handled inside VNet
      continue;
    } else {
      bicepCode += generateBicepModule(mod, {});
    }
  }

  return bicepCode;
}
