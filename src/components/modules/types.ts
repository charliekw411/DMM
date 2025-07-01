import type { VariableSchema } from "../common/ModuleConfigModal";

export type ModuleType =
  | "vnet"
  | "subnet"
  | "nsg"
  | "firewall"
  | "publicip"
  | "routetable"
  | "resourcegroup";

export type ConnectionType = "subnet-association" | "dependency" | "peering";

export interface Module {
  id: string;
  type: ModuleType;
  name: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  resourcegroup?: string;
  variables: Record<string, any>;
}

export interface Connection {
  from: string;
  to: string;
  type: ConnectionType;
}

export interface ModuleDefinition {
  type: string;
  name: string;
  initialVariables: Record<string, any>;
  variableSchema: VariableSchema;
  avm?: {
    moduleName: string;
    versionKey: string;
    outputVars?: string[];
  };
  createBundle?: (
    x: number,
    y: number,
    values: Record<string, string>
  ) => {
    modules: Module[];
    connections: {
      from: string;
      to: string;
      type: string;
    }[];
  };
}
