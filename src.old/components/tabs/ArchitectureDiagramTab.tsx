// src/components/tabs/ArchitectureDiagramTab.tsx
import React, { useState } from "react";
import {
  Layers,
  Share2,
  Shield,
  LayoutGrid,
  Trash,
} from "lucide-react";
import { useLandingZone } from "../context/LandingZonesContext";
import { Module } from "../modules/types";

const ICONS: Record<Module["type"], JSX.Element> = {
  vnet: <Layers className="h-8 w-8 text-green-600" />,
  subnet: <Share2 className="h-8 w-8 text-blue-600" />,
  firewall: <Shield className="h-8 w-8 text-red-600" />,
  nsg: <LayoutGrid className="h-8 w-8 text-yellow-600" />,
};

const ArchitectureDiagramTab: React.FC = () => {
  const { config, setConfig } = useLandingZone();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const modules = config.modules;

  const onMouseDown = (e: React.MouseEvent, module: Module) => {
    setDraggingId(module.id);
    setOffset({ x: e.clientX - module.position.x, y: e.clientY - module.position.y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const updated = modules.map((mod) => {
      if (mod.id === draggingId) {
        return {
          ...mod,
          position: {
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
          },
        };
      }
      return mod;
    });
    setConfig({ ...config, modules: updated });
  };

  const onMouseUp = () => setDraggingId(null);

  const onEdit = (mod: Module) => {
    setSelectedId(mod.id);
    setEditValue(mod.name);
  };

  const onSave = () => {
    setConfig({
      ...config,
      modules: modules.map((mod) =>
        mod.id === selectedId ? { ...mod, name: editValue } : mod
      ),
    });
    setSelectedId(null);
  };

  const onDelete = (id: string) => {
    setConfig({
      ...config,
      modules: modules.filter((m) => m.id !== id && m.parentId !== id),
    });
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <h2 className="text-xl font-semibold mb-4">Modular Architecture Diagram</h2>
      <div className="relative h-[600px] border-2 border-dashed border-gray-300 rounded-lg">
        {modules.map((mod) => (
          <div
            key={mod.id}
            onMouseDown={(e) => onMouseDown(e, mod)}
            className="absolute border shadow bg-white rounded p-2 cursor-move"
            style={{ left: mod.position.x, top: mod.position.y }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold">{mod.name}</span>
              <div className="flex gap-1">
                <button onClick={() => onEdit(mod)}>
                  ✏️
                </button>
                <button onClick={() => onDelete(mod.id)}>
                  <Trash className="w-3 h-3 text-red-600" />
                </button>
              </div>
            </div>
            <div className="flex justify-center">{ICONS[mod.type]}</div>
          </div>
        ))}

        {selectedId && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow max-w-sm w-full">
              <h4 className="text-md font-semibold mb-4">Edit Module</h4>
              <input
                className="w-full border rounded px-3 py-2"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={onSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setSelectedId(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchitectureDiagramTab;
