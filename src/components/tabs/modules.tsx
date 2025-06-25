// src/components/tabs/modules.tsx
import React, { useState } from "react";
import { useApp } from "../context/appContext";
import { Module, ModuleType } from "../modules/types";
import { moduleVariableSchemas } from "../modules/variableschemas";
import { ICONS } from "../modules/icons";
import { v4 as uuidv4 } from "uuid";

// Load modules dynamically (excluding utils & types)
const modules = import.meta.glob("../modules/!(*utils|types).ts", {
  eager: true,
}) as Record<string, { default: any }>;

const availableModules = Object.values(modules)
  .map((mod) => mod.default)
  .filter((mod) => mod && mod.type && mod.name);

const ModulesTab: React.FC = () => {
  const { config, setConfig } = useApp();
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const handleAdd = () => {
    if (!selectedModule) return;

    const id = uuidv4();
    const newModule: Module = {
      id,
      type: selectedModule.type as ModuleType,
      name: selectedModule.name,
      position: { x: 100, y: 100 },
      variables: form,
    };

    setConfig({ ...config, modules: [...config.modules, newModule] });
    setSelectedModule(null);
    setForm({});
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Modules</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableModules.map((mod) => {
          const Icon = ICONS[mod.type as ModuleType];
          return (
            <button
              key={mod.type}
              onClick={() => {
                setSelectedModule(mod);
                setForm(mod.defaultVariables || {});
              }}
              className="flex flex-col items-center border rounded p-4 hover:bg-gray-50"
            >
              <Icon />
              <span className="text-sm mt-2">{mod.name}</span>
            </button>
          );
        })}
      </div>

      {selectedModule && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSelectedModule(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Configure {selectedModule.name}
              </h3>
              {Object.entries(moduleVariableSchemas[selectedModule.type] || {}).map(
                ([key, schema]) => (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      {schema.label}
                    </label>
                    <input
                      type="text"
                      className="border px-3 py-2 rounded w-full"
                      value={form[key] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                    {schema.description && (
                      <p className="text-xs text-gray-500">{schema.description}</p>
                    )}
                    {schema.validate &&
                      schema.validate(form[key]) && (
                        <p className="text-xs text-red-500">
                          {schema.validate(form[key])}
                        </p>
                      )}
                  </div>
                )
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="text-sm px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="text-sm px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Add to Diagram
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModulesTab;
