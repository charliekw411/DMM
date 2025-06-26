import React, { useState } from "react";
import { useApp } from "../context/appContext";
import { Module } from "../modules/types";
import { ICONS } from "../modules/icons";
import { moduleVariableSchemas } from "../modules/variableschemas";

const ArchitectureDiagramTab: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const { config, setConfig } = useApp();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const modules = config.modules;

  const updateModule = (updated: Module) => {
    const updatedModules = modules.map((m) =>
      m.id === updated.id ? updated : m
    );
    setConfig({ ...config, modules: updatedModules });
  };

  const onMouseDown = (
    e: React.MouseEvent,
    id: string,
    position: { x: number; y: number }
  ) => {
    e.stopPropagation();
    setDraggingId(id);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (draggingId) {
      const dragged = modules.find((m) => m.id === draggingId);
      if (!dragged) return;

      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      const resourceGroups = modules.filter((m) => m.type === "resourceGroup");

      const containingRG = resourceGroups.find(
        (rg) =>
          dragged.type !== "resourceGroup" &&
          newX >= rg.position.x &&
          newY >= rg.position.y &&
          newX <= rg.position.x + (rg.width ?? 300) &&
          newY <= rg.position.y + (rg.height ?? 200)
      );

      const relativeX = containingRG ? newX - containingRG.position.x : newX;
      const relativeY = containingRG ? newY - containingRG.position.y : newY;

      const updated = {
        ...dragged,
        position: { x: relativeX, y: relativeY },
        resourceGroup: containingRG?.id ?? undefined,
      };

      const updatedModules = modules.map((m) =>
        m.id === draggingId ? updated : m
      );

      setConfig({ ...config, modules: updatedModules });
    }

    if (resizingId) {
      const rg = modules.find((m) => m.id === resizingId);
      if (!rg || rg.type !== "resourceGroup") return;

      const deltaX = e.clientX - offset.x;
      const deltaY = e.clientY - offset.y;
      const newWidth = (rg.width ?? 300) + deltaX;
      const newHeight = (rg.height ?? 200) + deltaY;

      const updated = {
        ...rg,
        width: Math.max(newWidth, 100),
        height: Math.max(newHeight, 80),
      };

      const updatedModules = modules.map((m) =>
        m.id === resizingId ? updated : m
      );

      setConfig({ ...config, modules: updatedModules });
      setOffset({ x: e.clientX, y: e.clientY });
    }
  };

  const onMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
  };

  const removeModule = (id: string) => {
    const updated = modules.filter((m) => m.id !== id);
    setConfig({ ...config, modules: updated });
  };

  const resourceGroups = modules.filter((m) => m.type === "resourceGroup");
  const otherModules = modules.filter((m) => m.type !== "resourceGroup");

  return (
    <div
      className="bg-white p-6 rounded shadow-md min-h-[500px] relative select-none"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <h2 className="text-xl font-semibold mb-4">Architecture Diagram</h2>
      <div className="mb-3 flex gap-4 items-center">
        <button onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))} className="px-2 py-1 border rounded">Zoom Out</button>
        <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="px-2 py-1 border rounded">Zoom In</button>
        <span className="text-sm text-gray-600">Zoom: {Math.round(zoom * 100)}%</span>
      </div>

      <div className="relative border rounded bg-gray-50 overflow-auto w-[85vw] h-[85vh]">
        <div style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}>
        {resourceGroups.map((rg) => (
          <div
            key={rg.id}
            className="absolute border-2 border-blue-400 bg-blue-50 rounded"
            style={{
              left: rg.position.x,
              top: rg.position.y,
              width: rg.width ?? 300,
              height: rg.height ?? 200,
            }}
            onMouseDown={(e) => onMouseDown(e, rg.id, rg.position)}
          >
            <div className="flex justify-between px-2 py-1 text-sm bg-blue-100 font-medium">
              <span>{rg.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModule(rg);
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  ✎
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeModule(rg.id);
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  ✕
                </button>
              </div>
            </div>
            <div
              className="absolute bottom-0 right-0 w-3 h-3 bg-blue-400 cursor-nwse-resize"
              onMouseDown={(e) => {
                e.stopPropagation();
                setResizingId(rg.id);
                setOffset({ x: e.clientX, y: e.clientY });
              }}
            />
          </div>
        ))}

        {otherModules.map((mod) => {
          const Icon = ICONS[mod.type];
          if (!Icon) return null;

          const rg = resourceGroups.find((r) => r.id === mod.resourceGroup);
          const left = mod.position.x + (rg?.position.x ?? 0);
          const top = mod.position.y + (rg?.position.y ?? 0);

          return (
            <div
              key={mod.id}
              className="absolute flex flex-col items-center cursor-move text-center"
              style={{ left, top }}
              onMouseDown={(e) => onMouseDown(e, mod.id, { x: left, y: top })}
              onDoubleClick={() => setSelectedModule(mod)}
            >
              <Icon />
              <span className="text-xs mt-1 font-medium">{mod.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeModule(mod.id);
                }}
                className="text-red-500 text-xs mt-1 hover:underline"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
      </div>
      {selectedModule && (
      <>
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSelectedModule(null)}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Module</h3>
            {Object.entries(selectedModule.variables ?? {}).map(
              ([key, value]) => {
                const schema =
                  moduleVariableSchemas[selectedModule.type]?.[key];
                return (
                  <div key={key} className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      {schema?.label ?? key}
                    </label>
                    <input
                      type={schema?.type ?? "text"}
                      value={value}
                      onChange={(e) => {
                        const updatedValue = e.target.value;
                        const error = schema?.validate?.(updatedValue) ?? null;
                        const updatedVariables = {
                          ...selectedModule.variables,
                          [key]: updatedValue,
                        };

                        setSelectedModule({
                          ...selectedModule,
                          variables: updatedVariables,
                          error: error ?? undefined,
                        });
                      }}
                      className="w-full border rounded px-3 py-1"
                    />
                    {schema?.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {schema.description}
                      </p>
                    )}
                    {selectedModule.error && (
                      <p className="text-xs text-red-500">
                        {selectedModule.error}
                      </p>
                    )}
                  </div>
                );
              }
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const autoNameKey = Object.keys(selectedModule.variables ?? {}).find(k =>
                    k.toLowerCase().includes("name")
                  );
                  const newName = autoNameKey
                    ? selectedModule.variables?.[autoNameKey] ?? selectedModule.name
                    : selectedModule.name;

                  updateModule({ ...selectedModule, name: newName });
                  setSelectedModule(null);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </>
    )}
    </div>
  );
};

export default ArchitectureDiagramTab;
