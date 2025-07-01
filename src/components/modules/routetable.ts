import { ModuleDefinition } from "./types";

export const moduleDefinition: ModuleDefinition = {
  name: "Route Table",
  type: "routetable",
  initialVariables: {
    routeTableName: "rt-default",
  },
  variableSchema: {
    routeTableName: {
      label: "Route Table Name",
      type: "string",
      required: true,
      description: "The name of the route table",
    },
  },
};

export default { moduleDefinition };
