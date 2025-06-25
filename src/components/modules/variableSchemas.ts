// src/components/modules/variableSchemas.ts

export type VariableField = {
  label: string;
  description?: string;
  type: "text" | "number" | "dropdown" | "checkbox";
  options?: string[]; // for dropdown
  validate?: (val: string) => string | null; // returns error message or null
};

export const moduleVariableSchemas: Record<
  string,
  Record<string, VariableField>
> = {
  vnet: {
    name: {
      label: "VNet Name",
      description: "The name of your virtual network",
      type: "text",
      validate: (v) => (v.trim() === "" ? "Name is required" : null),
    },
    addressSpace: {
      label: "Address Space",
      description: "CIDR range, e.g., 10.0.0.0/16",
      type: "text",
      validate: (v) =>
        /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(v)
          ? null
          : "Invalid CIDR format",
    },
  },
  subnet: {
    name: {
        label: "Subnet Name",
        type: "text",
    },
    addressPrefix: {
        label: "Subnet Address",
        description: "CIDR prefix, e.g., 10.0.1.0/24",
        type: "text",
        validate: (v) =>
        /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(v)
            ? null
            : "Invalid CIDR format",
        },
    },
  firewall: {
    name: {
      label: "Firewall Name",
      type: "text",
    },
    subnet: {
      label: "Subnet Name",
      type: "text",
      description: "Must be AzureFirewallSubnet",
      validate: (v) =>
        v === "AzureFirewallSubnet"
          ? null
          : "Firewall subnet must be 'AzureFirewallSubnet'",
    },
    addressPrefix: {
        label: "Subnet Address",
        description: "CIDR prefix, e.g., 10.0.1.0/24",
        type: "text",
        validate: (v) =>
        /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(v)
            ? null
            : "Invalid CIDR format",
        },
  },
};
