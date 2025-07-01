import { ModuleDefinition } from "./types";

export const moduleDefinition: ModuleDefinition = {
  name: "Network Security Group",
  type: "nsg",
  initialVariables: {
    nsgName: "nsg-default",
  },
  variableSchema: {
    nsgName: {
      label: "NSG Name",
      type: "string",
      required: true,
      description: "The name of the Network Security Group",
    },
  },
};

export default { moduleDefinition };
