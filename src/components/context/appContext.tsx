import React, { createContext, useContext, useState } from "react";
import { Module } from "../modules/types";

export type IaCLanguage = "bicep" | "terraform" | "ansible";

export interface Tag {
  name: string;
  value: string;
}
export type Connection = {
  from: string;
  to: string;
  type: "subnet-association" | "dependency" | "peering";
};

export interface AppConfig {
  modules: Module[];
  connections: Connection[];
  project?: {
    language?: IaCLanguage;
    tenantId?: string;
    subscriptionId?: string;
    platform?: string;
    environment?: string;
    location?: string;
    tags?: Tag[];
  };
}

interface AppContextType {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>({
    modules: [],
    connections: [],
    project: {
      tenantId: "",
      subscriptionId: "",
      platform: "",
      environment: "",
      language: "bicep",
      tags: [],
    },
  });

  return (
    <AppContext.Provider value={{ config, setConfig }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export interface ProjectConfig {
  tenantId?: string;
  subscriptionId?: string;
  platform?: "azure" | "aws" | "gcp" | "onprem";
  language?: "bicep" | "terraform" | "ansible";
  environment?: string;
  location?: string;
  tags?: Tag[];
}
