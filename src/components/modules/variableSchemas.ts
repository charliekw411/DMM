import { VariableSchema } from "../common/ModuleConfigModal";

export const moduleVariableSchemas: Record<string, VariableSchema> = {
  vnet: {
    vnetName: {
      label: "VNet Name",
      description: "The name of your virtual network",
      type: "string",
      required: true,
      validate: (v) =>
        typeof v !== "string" || v.trim() === "" ? "Name is required" : true,
    },
    cidr: {
      label: "Address Space (CIDR)",
      description: "e.g., 10.0.0.0/16",
      type: "string",
      required: true,
      validate: (v) =>
        typeof v !== "string" || !/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(v)
          ? "Invalid CIDR format"
          : true,
    },
  },

  subnet: {
    subnetName: {
      label: "Subnet Name",
      description: "The name of your subnet",
      type: "string",
      required: true,
      validate: (v) =>
        typeof v !== "string" || v.trim() === "" ? "Name is required" : true,
    },
    cidr: {
      label: "Subnet Address Prefix (CIDR)",
      description: "e.g., 10.0.1.0/24",
      type: "string",
      required: true,
      validate: (v) =>
        typeof v !== "string" || !/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(v)
          ? "Invalid CIDR format"
          : true,
    },
  },

  publicip: {
    publicIpName: {
      label: "Public IP Name",
      type: "string",
      required: true,
      validate: (v) =>
        typeof v !== "string" || v.trim() === "" ? "Name is required" : true,
    },
    sku: {
      label: "SKU",
      type: "select",
      required: true,
      options: ["Standard", "Basic"],
    },
    allocationMethod: {
      label: "Allocation Method",
      type: "select",
      required: true,
      options: ["Static", "Dynamic"],
    },
  },

  firewall: {
    firewallName: {
      label: "Firewall Name",
      type: "string",
      required: true,
      validate: (v) =>
        typeof v !== "string" || v.trim() === "" ? "Name is required" : true,
    },
  },

  nsg: {
    nsgName: {
      label: "NSG Name",
      type: "string",
      required: true,
      validate: (v) =>
        typeof v !== "string" || v.trim() === "" ? "Name is required" : true,
    },
  },

  routetable: {
    routeTableName: {
      label: "Route Table Name",
      type: "string",
      required: true,
      validate: (v) =>
        typeof v !== "string" || v.trim() === "" ? "Name is required" : true,
    },
  },

  resourcegroup: {
    resourceGroupName: {
      label: "Resource Group Name",
      type: "string",
      required: true,
      validate: (v) =>
        typeof v !== "string" || v.trim() === "" ? "Name is required" : true,
    },
  },
};