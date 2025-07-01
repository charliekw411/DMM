// src/components/patterns/types.ts
import { VariableSchema } from "../common/ModuleConfigModal";
import type { Module, Connection } from "../modules/types";
import type { ReactNode } from "react";

export interface PatternModule {
  name: string;
  description?: string;
  icon?: ReactNode;
  type: string;
  variableSchema?: VariableSchema;
  initialVariables?: Record<string, string>;
  create: (values: Record<string, string>) => {
    modules: Module[];
    connections: Connection[];
  };
}
