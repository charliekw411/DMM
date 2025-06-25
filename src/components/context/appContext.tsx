import React, { createContext, useContext, useEffect, useState } from "react";
import { Module } from "../modules/types";

export type ProjectConfig = {
  tenantId: string;
  subscriptionId: string;
  platform: string;
  environment: string;
  tags: { name: string; value: string }[];
};

export type AppConfig = {
  project: ProjectConfig;
  modules: Module[];
};

const defaultConfig: AppConfig = {
  project: {
    tenantId: "",
    subscriptionId: "",
    platform: "",
    environment: "",
    tags: [],
  },
  modules: [],
};

const CONFIG_KEY = "appConfig";

const AppContext = createContext<{
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
}>({
  config: defaultConfig,
  setConfig: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<AppConfig>(defaultConfig);

  useEffect(() => {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure tags is an array (backward compatibility)
        if (!Array.isArray(parsed.project?.tags)) {
          parsed.project.tags = [];
        }
        setConfigState(parsed);
      } catch {
        console.warn("Invalid config in localStorage");
      }
    }
  }, []);

  const setConfig = (c: AppConfig) => {
    setConfigState(c);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(c));
  };

  return (
    <AppContext.Provider value={{ config, setConfig }}>
      {children}
    </AppContext.Provider>
  );
};
