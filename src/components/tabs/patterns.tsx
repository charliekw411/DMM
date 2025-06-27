// src/components/tabs/patterns.tsx
import React, { useEffect, useState } from "react";
import { useApp } from "../context/appContext";
import { PatternModule, Module, Connection } from "../modules/types";
import { loadPatterns } from "../patterns/loadPatterns";
import { moduleVariableSchemas } from "../modules/variableSchemas";
import { v4 as uuidv4 } from "uuid";

const PatternsTab: React.FC = () => {
  const { config, setConfig } = useApp();
  const [patterns, setPatterns] = useState<PatternModule[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<PatternModule | null>(null);
  const [stagedModules, setStagedModules] = useState<Module[]>([]);
  const [stagedConnections, setStagedConnections] = useState<Connection[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setPatterns(loadPatterns());
  }, []);

  const handlePatternSelect = (pattern: PatternModule) => {
    const result = pattern.create({});

    const idMap: Record<string, string> = {};
    const enrichedModules = result.modules.map((mod) => {
      const id = uuidv4();
      idMap[mod.id] = id;
      const nameKey = Object.keys(mod.variables ?? {}).find(k => k.toLowerCase().includes("name"));
      const displayName = nameKey ? mod.variables?.[nameKey] : mod.name;
      return {
        ...mod,
        id,
        name: displayName,
      };
    });

    const enrichedConnections = result.connections.map((c) => ({
      from: idMap[c.from],
      to: idMap[c.to],
      type: c.type,
    }));

    setSelectedPattern(pattern);
    setStagedModules(enrichedModules);
    setStagedConnections(enrichedConnections);
    setStepIndex(0);
  };

  const updateStagedModule = (id: string, updated: Module) => {
    setStagedModules(stagedModules.map(m => (m.id === id ? updated : m)));
  };

  const finalizeModules = () => {
    setConfig({
      ...config,
      modules: [...config.modules, ...stagedModules],
      connections: [...config.connections, ...stagedConnections],
    });
    setStagedModules([]);
    setStagedConnections([]);
    setSelectedPattern(null);
    setStepIndex(0);
  };

  const currentModule = stagedModules[stepIndex];

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Available Patterns</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {patterns.map((pattern) => (
          <div key={pattern.name} className="border p-4 rounded shadow-sm">
            <h3 className="font-semibold text-sm mb-1">{pattern.name}</h3>
            <p className="text-xs text-gray-500 mb-2">
              {pattern.description}
            </p>
            <button
              onClick={() => handlePatternSelect(pattern)}
              className="mt-3 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add to Diagram
            </button>
          </div>
        ))}
      </div>

      {stagedModules.length > 0 && currentModule && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setStagedModules([])} />
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-6">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Configure module {stepIndex + 1} of {stagedModules.length}: {currentModule.type}
              </h3>
              {Object.entries(currentModule.variables ?? {}).map(([key, value]) => {
                const schema = moduleVariableSchemas[currentModule.type]?.[key];
                return (
                  <div key={key} className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      {schema?.label || key}
                    </label>
                    <input
                      type="text"
                      className="border px-3 py-1 rounded w-full"
                      value={value}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        const updated = {
                          ...currentModule,
                          variables: {
                            ...currentModule.variables,
                            [key]: newVal,
                          },
                          name: key.toLowerCase().includes("name") ? newVal : currentModule.name,
                        };
                        updateStagedModule(currentModule.id, updated);
                      }}
                    />
                    {schema?.description && (
                      <p className="text-xs text-gray-500">{schema.description}</p>
                    )}
                  </div>
                );
              })}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    if (stepIndex > 0) setStepIndex(stepIndex - 1);
                    else setStagedModules([]);
                  }}
                  className="text-sm px-4 py-2 rounded border"
                >
                  {stepIndex > 0 ? "Back" : "Cancel"}
                </button>
                {stepIndex < stagedModules.length - 1 ? (
                  <button
                    onClick={() => setStepIndex(stepIndex + 1)}
                    className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={finalizeModules}
                    className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Add to Diagram
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatternsTab;
