// src/components/modules/types.ts

export type ModuleType = "vnet" | "subnet" | "firewall" | "nsg";

export interface Module {
  id: string;
  type: ModuleType;
  name: string;
  position: {
    x: number;
    y: number;
  };
  parentId?: string; // Optional relationship for containment (e.g., subnet inside vnet)
}
