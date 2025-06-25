import React, { useEffect, useState } from "react";
import { useApp } from "../context/appContext";
import { PatternModule } from "../modules/types";
import { loadPatterns } from "../patterns/loadPatterns";

const PatternsTab: React.FC = () => {
  const { config, setConfig } = useApp();
  const [patterns, setPatterns] = useState<PatternModule[]>([]);

  useEffect(() => {
    setPatterns(loadPatterns());
  }, []);

  const onSelect = (pattern: PatternModule) => {
    const newModules = pattern.module?.() ?? [];
    setConfig({ ...config, modules: [...config.modules, ...newModules] });
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Available Patterns</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {patterns.map((pattern) => (
          <div key={pattern.name} className="border p-4 rounded shadow-sm">
            <h3 className="font-semibold text-sm mb-1">{pattern.name}</h3>
            <p className="text-xs text-gray-500">
              {pattern.description ?? "No description"}
            </p>
            <button
              onClick={() => onSelect(pattern)}
              className="mt-3 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add to Diagram
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternsTab;
