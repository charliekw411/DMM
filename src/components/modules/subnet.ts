import { ModuleDefinition } from "./types";
import { validateCidr } from "./utils";

export const moduleDefinition: ModuleDefinition = {
  name: "Subnet",
  type: "subnet",
  initialVariables: {
    subnetName: "default",
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
      validate: validateCidr,
    },
  },
};

export default { moduleDefinition };
