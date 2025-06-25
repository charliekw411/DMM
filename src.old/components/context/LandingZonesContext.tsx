import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Module } from "../../components/modules/types";

export interface ProjectSettings {
  tenantId: string;
  subscriptionId: string;
  namingConvention: string;
  platform: "azure" | "aws" | "gcp" | "onprem";
  tags: Record<string, string>;
}

export interface LandingZoneConfig {
  project: ProjectSettings;
  modules: Module[];
}

const CONFIG_KEY = "landingZoneConfig";

const defaultConfig: LandingZoneConfig = {
  project: {
    tenantId: "",
    subscriptionId: "",
    namingConvention: "",
    platform: "azure",
    tags: {}, 
  },
  modules: [],
};

const LandingZoneContext = createContext<{
  config: LandingZoneConfig;
  setConfig: (config: LandingZoneConfig) => void;
}>({
  config: defaultConfig,
  setConfig: () => {},
});

export const useLandingZone = () => useContext(LandingZoneContext);

export const LandingZoneProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [config, setConfigState] = useState<LandingZoneConfig>(defaultConfig);

  useEffect(() => {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      try {
        setConfigState(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse landing zone config from storage.");
      }
    }
  }, []);

  const setConfig = (newConfig: LandingZoneConfig) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
    setConfigState(newConfig);
  };

  return (
    <LandingZoneContext.Provider value={{ config, setConfig }}>
      {children}
    </LandingZoneContext.Provider>
  );
};
