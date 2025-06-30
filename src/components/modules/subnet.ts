import { ModuleDefinition } from "./types";
import { moduleIcons } from "./icons";

export const moduleDefinition: ModuleDefinition = {
  name: "Subnet",
  type: "subnet",
  defaultVariables: {
    subnetName: "subnet-1",
    addressPrefix: "10.0.1.0/24",
  },
  variableSchema: {
    subnetName: {
      label: "Subnet Name",
      type: "string",
      required: true,
      description: "The name of the subnet",
    },
    addressPrefix: {
      label: "Address Prefix",
      type: "string",
      required: true,
      description: "CIDR range for the subnet (e.g. 10.0.1.0/24)",
    },
  },
};

export default { moduleDefinition };
