export type ModuleType =
  | "vnet"
  | "subnet"
  | "nsg"
  | "firewall"
  | "routeTable"
  | "resourceGroup";

export interface PatternModule {
  name: string;
  description: string;
  inputs: string[];
  create: (inputs: Record<string, string>) => {
    modules: Module[];
    connections: Connection[];
  };
}

export interface Connection {
  from: string;
  to: string;
  type?: "subnet-association" | "peering" | "dependency";
}

export type Module = {
  id: string;
  type: ModuleType;
  name: string;
  position: { x: number; y: number };
  variables?: Record<string, any>;
  resourceGroup?: string;
  parentId?: string;
  width?: number;
  height?: number;
  error?: string | null;
};

export interface ResourceGroup {
  id: string;
  name: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  moduleIds: string[];
}
