import React, { useEffect, useState } from "react";
import { useApp } from "../context/appContext";
import { PatternModule } from "../modules/types";
import { loadPatterns } from "../patterns/loadPatterns";

const PatternsTab: React.FC = () => {
  const { config, setConfig } = useApp();
  const [patterns, setPatterns] = useState<PatternModule[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<PatternModule | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    setPatterns(loadPatterns());
  }, []);

  const handleAdd = () => {
    if (!selectedPattern) return;

    const newModules = selectedPattern.create(form);
    setConfig({ ...config, modules: [...config.modules, ...newModules] });

    setSelectedPattern(null);
    setForm({});
  };

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
              onClick={() => {
                setSelectedPattern(pattern);
                setForm({});
              }}
              className="mt-3 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add to Diagram
            </button>
          </div>
        ))}
      </div>

      {/* Pattern Input Modal */}
      {selectedPattern && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSelectedPattern(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Configure {selectedPattern.name}
              </h3>

              {(selectedPattern.inputs ?? []).map((key) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {key}
                  </label>
                  <input
                    type="text"
                    className="border px-3 py-2 rounded w-full"
                    value={form[key] ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setSelectedPattern(null)}
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

export default PatternsTab;
