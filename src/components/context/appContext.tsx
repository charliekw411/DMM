import React, { createContext, useContext, useState } from "react";
import { Module } from "../modules/types";

export interface Connection {
  from: string;
  to: string;
  type?: "subnet-association" | "peering" | "dependency";
}

export interface AppConfig {
  modules: Module[];
  connections: Connection[]; // added
}

interface AppContextType {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
}

const defaultConfig: AppConfig = {
  modules: [],
  connections: []
};

const AppContext = createContext<AppContextType>({
  config: defaultConfig,
  setConfig: () => {}
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);

  return (
    <AppContext.Provider value={{ config, setConfig }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
