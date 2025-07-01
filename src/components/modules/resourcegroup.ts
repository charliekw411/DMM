import { ModuleDefinition } from "./types";

export const moduleDefinition: ModuleDefinition = {
  name: "Resource Group",
  type: "resourcegroup",
  initialVariables: {
    resourceGroupName: "rg-",
    location: "AustraliaEast",
  },
  variableSchema: {
    resourceGroupName: {
      label: "Resource Group Name",
      type: "string",
      required: true,
      description: "The name of the Azure Resource Group",
    },
    location: {
      label: "Location",
      type: "string",
      required: true,
      description: "Azure region (e.g. eastus, westus2)",
    },
  },
};

export default { moduleDefinition };
