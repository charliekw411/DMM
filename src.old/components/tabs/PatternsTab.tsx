// src/components/tabs/PatternsTab.tsx
import React, { useState } from "react";
import { useLandingZone } from "../context/LandingZonesContext";
import { Module } from "../modules/types";

const PatternsTab: React.FC = () => {
  const { config, setConfig } = useLandingZone();
  const [patternName, setPatternName] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const createPattern = () => {
    if (!patternName || selectedModules.length === 0) return;
    const clonedModules: Module[] = selectedModules.map((id) => {
      const original = config.modules.find((m) => m.id === id);
      if (!original) return null;
      return {
        ...original,
        id: crypto.randomUUID(),
        name: `${patternName}-${original.name}`,
        position: { x: original.position.x + 20, y: original.position.y + 20 },
      };
    }).filter(Boolean) as Module[];

    setConfig({
      ...config,
      modules: [...config.modules, ...clonedModules],
    });
    setPatternName("");
    setSelectedModules([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Create Pattern from Modules</h2>

      <div className="mb-4">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Pattern Name"
          value={patternName}
          onChange={(e) => setPatternName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {config.modules.map((mod) => (
          <label
            key={mod.id}
            className={`border rounded p-3 cursor-pointer flex items-center gap-2 ${
              selectedModules.includes(mod.id) ? "border-blue-500 bg-blue-50" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selectedModules.includes(mod.id)}
              onChange={() => toggleSelect(mod.id)}
            />
            <span className="text-sm">{mod.name}</span>
          </label>
        ))}
      </div>

      <button
        onClick={createPattern}
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Create Pattern
      </button>
    </div>
  );
};

export default PatternsTab;
