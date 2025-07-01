// src/components/modules/publicip.ts
import type { ModuleDefinition } from "./types";

const moduleDefinition: ModuleDefinition = {
  type: "publicip",
  name: "Public IP",
  initialVariables: {
    publicIpName: "publicIp1",
    sku: "Standard",
    allocationMethod: "Static",
  },
  variableSchema: {
    publicIpName: {
      label: "Public IP Name",
      type: "string",
      required: true,
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
  avm: {
    moduleName: "network.public-ip",
    versionKey: "publicip",
    outputVars: ["id", "name"],
  },
};

export default { moduleDefinition };