"use client";
import React, { useState } from "react";

// types
import {
  LandingZoneConfig,
  LandingZonePattern,
  HubAndSpokePattern,
  GreenfieldPattern,
} from "../types/patterns";

// context
import {
  LandingZoneProvider,
  useLandingZone,
} from "../../components/context/LandingZonesContext";

// tabs
import ProjectTab from "../../components/tabs/ProjectTab";
import ArchitectureDiagramTab from "../../components/tabs/ArchitectureDiagramTab";
import PatternsTab from "../../components/tabs/PatternsTab";


const TABS = ["Project", "Architecture Diagram", "Patterns", "Modules   "] as const;
type Tab = typeof TABS[number];

const LandingZonePage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("Project");

  return (
    <LandingZoneProvider>
      <div className="p-4">
        <div className="flex gap-4 mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded ${
                tab === t ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "Project" && <ProjectTab />}
        {tab === "Architecture Diagram" && <ArchitectureDiagramTab />}
        {tab === "Patterns" && <PatternsTab />}
      </div>
    </LandingZoneProvider>
  );
};

export default LandingZonePage;
