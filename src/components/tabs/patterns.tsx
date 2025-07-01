// src/components/tabs/patterns.tsx
import React, { useState } from "react";
import { loadedPatterns } from "../patterns/loadPatterns";
import { useApp } from "../context/appContext";
import { moduleVariableSchemas } from "../modules/variableSchemas";
import { validateVariables } from "../modules/utils";
import type { PatternModule } from "../patterns/types";

const PatternsTab: React.FC = () => {
  const { config, setConfig } = useApp();
  const [selectedPattern, setSelectedPattern] = useState<PatternModule | null>(null);
  const [stagedModules, setStagedModules] = useState<any[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePatternSelect = (pattern: PatternModule | null) => {
    if (!pattern) return;
    const result = pattern.create(pattern.initialVariables ?? {});
    setStagedModules(result.modules);
    setSelectedPattern(pattern);
    setStepIndex(0);
    setErrors({});
  };

  const updateStagedModule = (id: string, updatedModule: any) => {
    setStagedModules((prev) =>
      prev.map((mod) => (mod.id === id ? updatedModule : mod))
    );
  };

  const finalizeModules = () => {
    if (!selectedPattern) return;
    const result = selectedPattern.create(
      selectedPattern.initialVariables ?? {}
    );
    setConfig({
      ...config,
      modules: [...config.modules, ...result.modules],
      connections: [...(config.connections ?? []), ...result.connections],
    });
    setSelectedPattern(null);
    setStagedModules([]);
    setStepIndex(0);
    setErrors({});
  };

  const currentModule = stagedModules[stepIndex];

  return (
    <div className="p-4">
      {!selectedPattern ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Available Patterns</h2>
          <div className="grid grid-cols-2 gap-4">
            {loadedPatterns.map((pattern) => (
              <div
                key={pattern.name}
                className="cursor-pointer border rounded p-4 hover:bg-gray-50"
                onClick={() => handlePatternSelect(pattern)}
              >
                <div className="text-xl mb-2">{pattern.icon}</div>
                <div className="font-semibold">{pattern.name}</div>
                <p className="text-sm text-gray-500">{pattern.description}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">
            Configure: {selectedPattern!.name}
          </h3>

          {Object.entries(currentModule.variables ?? {}).map(([key, value]) => {
            const schema = moduleVariableSchemas[currentModule.type]?.[key];
            console.log("Field:", key, "Schema:", schema, "Value:", value);
            if (!schema) return null;

            return (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  {schema.label} {schema.required && <span className="text-red-500">*</span>}
                </label>
                {schema.type === "select" && schema.options ? (
                  <select
                    value={String(value ?? "")}
                    onChange={(e) => {
                      const updated = {
                        ...currentModule,
                        variables: {
                          ...currentModule.variables,
                          [key]: e.target.value,
                        },
                      };
                      updateStagedModule(currentModule.id, updated);
                      setErrors((prev) => ({ ...prev, [key]: "" }));
                    }}
                    className={`w-full border px-3 py-2 rounded ${
                      errors[key] ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select...</option>
                    {schema.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={schema.type === "number" ? "number" : "text"}
                    value={String(value ?? "")}
                    onChange={(e) => {
                      const newVal = e.target.value;
                      const updated = {
                        ...currentModule,
                        variables: {
                          ...currentModule.variables,
                          [key]: newVal,
                        },
                        name: key.toLowerCase().includes("name")
                          ? newVal
                          : currentModule.name,
                      };
                      updateStagedModule(currentModule.id, updated);
                      setErrors((prev) => ({ ...prev, [key]: "" }));
                    }}
                    className={`w-full border px-3 py-2 rounded ${
                      errors[key] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
                {schema.description && (
                  <p className="text-xs text-gray-500">{schema.description}</p>
                )}
                {errors[key] && (
                  <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
                )}
              </div>
            );
          })}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => {
                if (stepIndex === 0) {
                  setSelectedPattern(null);
                } else {
                  setStepIndex(stepIndex - 1);
                  setErrors({});
                }
              }}
              className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              {stepIndex === 0 ? "Cancel" : "Back"}
            </button>

            {stepIndex < stagedModules.length - 1 ? (
              <button
                onClick={() => {
                  const schema = moduleVariableSchemas[currentModule.type] ?? {};
                  const validationErrors = validateVariables(
                    schema,
                    currentModule.variables ?? {}
                  );
                  setErrors(validationErrors);

                  if (Object.keys(validationErrors).length === 0) {
                    setStepIndex(stepIndex + 1);
                  }
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => {
                  const schema = moduleVariableSchemas[currentModule.type] ?? {};
                  const validationErrors = validateVariables(
                    schema,
                    currentModule.variables ?? {}
                  );
                  setErrors(validationErrors);

                  if (Object.keys(validationErrors).length === 0) {
                    finalizeModules();
                  }
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Add to Diagram
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternsTab;
