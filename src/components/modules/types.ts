import type { VariableSchema } from "../common/ModuleConfigModal";

export type ModuleType =
  | "vnet"
  | "subnet"
  | "nsg"
  | "firewall"
  | "resourcegroup"
  | "routetable";

export type ConnectionType = "subnet-association" | "dependency" | "peering";

export interface Module {
  id: string;
  name: string;
  type: ModuleType;
  position: { x: number; y: number };
  width?: number;                     
  height?: number;

  variables: Record<string, string>;
  resourcegroup?: string;
}

export interface Connection {
  from: string;
  to: string;
  type: ConnectionType;
}

export interface ModuleDefinition {
  name: string;
  type: ModuleType;
  defaultVariables?: Record<string, string>;
  variableSchema: VariableSchema;
}