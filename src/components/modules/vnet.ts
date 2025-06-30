import { ModuleDefinition } from "./types";

export const moduleDefinition: ModuleDefinition = {
  name: "Virtual Network",
  type: "vnet",
  defaultVariables: {
    vnetName: "vnet-hub",
    addressPrefix: "10.0.0.0/16",
  },
  variableSchema: {
    vnetName: {
      label: "VNet Name",
      type: "string",
      required: true,
      description: "The name of the Virtual Network",
    },
    addressPrefix: {
      label: "Address Prefix",
      type: "string",
      required: true,
      description: "CIDR range for the VNet (e.g. 10.0.0.0/16)",
    },
  },
};

export default { moduleDefinition };
