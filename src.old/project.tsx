import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { LandingZoneConfig } from "./components/types/patterns";

const CONFIG_KEY = "landingZoneConfig";

const defaultConfig: LandingZoneConfig = {
  patterns: [],
  project: {
    tenantId: "",
    subscriptionId: "",
    environment: "",
    platform: "Azure",
    tags: {},
  },
};

export const LandingZoneContext = createContext<{
  config: LandingZoneConfig;
  setConfig: (c: LandingZoneConfig) => void;
}>({
  config: defaultConfig,
  setConfig: () => {},
});

export const useLandingZone = () => useContext(LandingZoneContext);

export const LandingZoneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<LandingZoneConfig>(defaultConfig);

  useEffect(() => {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      try {
        setConfigState(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse stored config");
      }
    }
  }, []);

  const setConfig = (c: LandingZoneConfig) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(c));
    setConfigState(c);
  };

  return (
    <LandingZoneContext.Provider value={{ config, setConfig }}>
      {children}
    </LandingZoneContext.Provider>
  );
};
