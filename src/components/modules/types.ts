export type ModuleType =
  | "vnet"
  | "subnet"
  | "nsg"
  | "firewall"
  | "routeTable"
  | "resourceGroup";

export type PatternModule = {
  name: string;
  description?: string;
  module?: () => Module[];
};

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
  //error: error || undefined;
};

export interface ResourceGroup {
  id: string;
  name: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  moduleIds: string[];
}
