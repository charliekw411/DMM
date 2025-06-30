import { ModuleDefinition } from "./types";

export const moduleDefinition: ModuleDefinition = {
  name: "Firewall",
  type: "firewall",
  defaultVariables: {
    firewallName: "azfw",
    subnetId: "", // must be populated at runtime
  },
  variableSchema: {
    firewallName: {
      label: "Firewall Name",
      type: "string",
      required: true,
      description: "The name of the Azure Firewall resource",
    },
    subnetId: {
      label: "Subnet ID",
      type: "string",
      required: true,
      description: "The ID of the subnet where the firewall will be deployed (must be AzureFirewallSubnet)",
    },
  },
};

export default { moduleDefinition };
