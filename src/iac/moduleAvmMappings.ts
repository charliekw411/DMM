export const moduleAvmMappings: Record<string, { path: string; versionKey: string }> = {
  vnet: {
    path: "avm/res/network/virtual-network",
    versionKey: "virtual-network",
  },
  subnet: {
    path: "avm/res/network/subnet",
    versionKey: "subnet",
  },
  nsg: {
    path: "avm/res/network/network-security-group",
    versionKey: "network-security-group",
  },
  firewall: {
    path: "avm/res/network/azure-firewall",
    versionKey: "firewall",
  },
  publicip: {
    path: "avm/res/network/public-ip-address",
    versionKey: "publicip",
  },
  resourcegroup: {
    path: "avm/res/resources/resource-group",
    versionKey: "resource-group",
  },
};
