// src/iac/moduleAvmPaths.ts

export const moduleAvmPaths: Record<string, string> = {
  vnet: "avm/res/network/virtual-network",
  subnet: "avm/res/network/subnet", // Included for completeness (even if skipped in output)
  nsg: "avm/res/network/network-security-group",
  firewall: "avm/res/network/azure-firewall",
  publicip: "avm/res/network/public-ip-address",
  routetable: "avm/res/network/route-table",
  resourcegroup: "avm/res/resources/resource-group", // Optional
};
