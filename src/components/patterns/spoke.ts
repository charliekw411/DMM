import { v4 as uuidv4 } from "uuid";
import type { PatternModule } from "./types";
import type { Module, Connection } from "../modules/types";
import { validateCidr, getAutoName, getDefaultCidr } from "../modules/utils";

const spoke: PatternModule = {
  name: "Spoke Network",
  description: "Creates a VNet and Subnet for a typical spoke in Hub & Spoke architecture.",
  type: "spoke",
  initialVariables: {
    vnetName: "spoke-vnet",
    subnetName: "spoke-subnet",
    addressPrefix: "10.1.0.0/16",
    subnetPrefix: "10.1.0.0/24",
  },
  variableSchema: {
    vnetName: { label: "VNet Name", type: "string", required: true },
    subnetName: { label: "Subnet Name", type: "string", required: true },
    addressPrefix: {
      label: "VNet CIDR",
      type: "string",
      required: true,
      validate: validateCidr,
    },
    subnetPrefix: {
      label: "Subnet CIDR",
      type: "string",
      required: true,
      validate: validateCidr,
    },
  },
  create: (values): { modules: Module[]; connections: Connection[] } => {
    const modules: Module[] = [];

    const vnetCount = modules.filter((m) => m.type === "vnet").length;
    const vnetName = getAutoName("vnet", modules);
    const vnetId = uuidv4();
    modules.push({
      id: vnetId,
      type: "vnet",
      name: vnetName,
      position: { x: 100, y: 100 },
      variables: {
        vnetName: values.vnetName || vnetName,
        cidr: values.addressPrefix || getDefaultCidr("vnet", vnetCount),
      },
    });

    const subnetCount = modules.filter((m) => m.type === "subnet").length;
    const subnetName = getAutoName("subnet", modules);
    const subnetId = uuidv4();
    modules.push({
      id: subnetId,
      type: "subnet",
      name: subnetName,
      position: { x: 300, y: 100 },
      variables: {
        subnetName: values.subnetName || subnetName,
        cidr: values.subnetPrefix || getDefaultCidr("subnet", subnetCount),
      },
    });

    const connections: Connection[] = [
      { from: subnetId, to: vnetId, type: "subnet-association" },
    ];

    return { modules, connections };
  },
};

export default spoke;
export const createSpokePattern = spoke.create;
export const initialValues = spoke.initialVariables;
