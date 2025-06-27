// src/components/tabs/architectureDiagram.tsx
import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/appContext";
import { Module } from "../modules/types";
import { ICONS } from "../modules/icons";
import { moduleVariableSchemas } from "../modules/variableSchemas";
import { exportToBicep } from "../../iac/exporter";

type ModuleConnection = {
  from: string;
  to: string;
  type: "subnet-association" | "peering" | "dependency";
};

const getConnectionType = (
  fromType: string,
  toType: string
): ModuleConnection["type"] => {
  const key = `${fromType}->${toType}`;
  const map: Record<string, ModuleConnection["type"]> = {
    "subnet->vnet": "subnet-association",
    "vnet->subnet": "subnet-association",
    "vnet->vnet": "peering",
    "subnet->nsg": "dependency",
    "nsg->subnet": "dependency",
    "subnet->firewall": "dependency",
    "firewall->subnet": "dependency",
  };
  return map[key] ?? "dependency";
};

const ArchitectureDiagramTab: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const { config, setConfig } = useApp();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [draggingFrom, setDraggingFrom] = useState<Module | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  const modules = config.modules;
  const resourceGroups = modules.filter((m) => m.type === "resourceGroup");
  const otherModules = modules.filter((m) => m.type !== "resourceGroup");

  const updateModule = (updated: Module) => {
    const updatedModules = modules.map((m) =>
      m.id === updated.id ? updated : m
    );
    setConfig({ ...config, modules: updatedModules });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Avoid deleting when inside an input, textarea, or content-editable element
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === "Delete" && selectedId) {
        const isModule = modules.find((m) => m.id === selectedId);
        if (isModule) {
          setConfig({
            ...config,
            modules: config.modules.filter((m) => m.id !== selectedId),
            connections: config.connections?.filter(
              (c) => c.from !== selectedId && c.to !== selectedId
            ),
          });
        } else {
          setConfig({
            ...config,
            connections: config.connections?.filter(
              (c) => `${c.from}-${c.to}` !== selectedId
            ),
          });
        }
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, config]);

  const onMouseDown = (
    e: React.MouseEvent,
    id: string,
    position: { x: number; y: number }
  ) => {
    e.stopPropagation();
    setDraggingId(id);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    setSelectedId(id);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const canvasX = (e.clientX - (rect?.left ?? 0)) / zoom;
    const canvasY = (e.clientY - (rect?.top ?? 0)) / zoom;
    setMousePos({ x: canvasX, y: canvasY });

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

      setConfig({
        ...config,
        modules: modules.map((m) => (m.id === draggingId ? updated : m)),
      });
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

      setConfig({
        ...config,
        modules: modules.map((m) => (m.id === resizingId ? updated : m)),
      });
      setOffset({ x: e.clientX, y: e.clientY });
    }
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (isDrawing && draggingFrom) {
      const rect = canvasRef.current?.getBoundingClientRect();
      const mx = (e.clientX - (rect?.left ?? 0)) / zoom;
      const my = (e.clientY - (rect?.top ?? 0)) / zoom;

      const target = otherModules.find((mod) => {
        const rg = resourceGroups.find((r) => r.id === mod.resourceGroup);
        const x = mod.position.x + (rg?.position.x ?? 0);
        const y = mod.position.y + (rg?.position.y ?? 0);
        return (
          mx >= x &&
          my >= y &&
          mx <= x + 64 &&
          my <= y + 64 &&
          mod.id !== draggingFrom.id
        );
      });

      if (
        target &&
        draggingFrom.type !== "resourceGroup" &&
        target.type !== "resourceGroup"
      ) {
        const exists = config.connections?.some(
          (c) => c.from === draggingFrom.id && c.to === target.id
        );

        if (!exists) {
          const type = getConnectionType(draggingFrom.type, target.type);
          const newConn: ModuleConnection = {
            from: draggingFrom.id,
            to: target.id,
            type,
          };

          setConfig({
            ...config,
            connections: [...(config.connections ?? []), newConn],
          });
        }
      }
    }

    setDraggingId(null);
    setResizingId(null);
    setDraggingFrom(null);
  };

  const removeModule = (id: string) => {
    const updated = config.modules.filter((m) => m.id !== id);
    const updatedConnections = config.connections?.filter(
      (c) => c.from !== id && c.to !== id
    );
    setConfig({ ...config, modules: updated, connections: updatedConnections });
  };
  return (
    <div
      className="bg-white p-6 rounded shadow-md min-h-[500px] relative select-none"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <h2 className="text-xl font-semibold mb-4">Architecture Diagram</h2>
      <div className="mb-3 flex gap-4 items-center">
        <button onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))} className="px-2 py-1 border rounded">
          Zoom Out
        </button>
        <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="px-2 py-1 border rounded">
          Zoom In
        </button>
        <button onClick={() => setIsDrawing((d) => !d)} className={`px-3 py-1 rounded border ${isDrawing ? "bg-blue-600 text-white" : ""}`}>
          {isDrawing ? "Exit Connection Mode" : "Resources Connect Mode"}
        </button>
        <span className="text-sm text-gray-600">Zoom: {Math.round(zoom * 100)}%</span>
        <button
          onClick={() => {
            const content = exportToBicep(config);
            const blob = new Blob([content], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "architecture.bicep";
            link.click();
          }}
          className="ml-4 text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
          title="Export to Bicep"
        >
          ⬇️ Export
        </button>
      </div>

      <div ref={canvasRef} className="relative border rounded bg-gray-50 overflow-auto w-[85vw] h-[85vh]">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {resourceGroups.map((rg) => (
            <div
              key={rg.id}
              className={`absolute border-2 border-blue-400 bg-blue-50 rounded ${
                selectedId === rg.id ? "ring-2 ring-blue-500" : ""
              }`}
              style={{
                left: rg.position.x,
                top: rg.position.y,
                width: rg.width ?? 300,
                height: rg.height ?? 200,
              }}
              onMouseDown={(e) => onMouseDown(e, rg.id, rg.position)}
              onDoubleClick={() => setSelectedModule(rg)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between px-2 py-1 text-sm bg-blue-100 font-medium">
                <span>{rg.name}</span>
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
            const isSelected = selectedId === mod.id;

            return (
              <div
                key={mod.id}
                className={`absolute flex flex-col items-center cursor-move text-center p-1 ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                style={{ left, top }}
                onMouseDown={(e) => onMouseDown(e, mod.id, { x: left, y: top })}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(mod.id);
                }}
                onDoubleClick={() => setSelectedModule(mod)}
              >
                <Icon />
                <span className="text-xs mt-1 font-medium">{mod.name}</span>
                {isDrawing && (
                  <div
                    className="w-3 h-3 rounded-full bg-blue-600 cursor-crosshair mt-1"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDraggingFrom(mod);
                    }}
                  />
                )}
              </div>
            );
          })}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
              </marker>
            </defs>

            {(config.connections ?? []).map((conn) => {
              const from = modules.find((m) => m.id === conn.from);
              const to = modules.find((m) => m.id === conn.to);
              if (!from || !to) return null;

              const fromRG = modules.find((r) => r.id === from.resourceGroup);
              const toRG = modules.find((r) => r.id === to.resourceGroup);

              const fx = from.position.x + (fromRG?.position.x ?? 0) + 32;
              const fy = from.position.y + (fromRG?.position.y ?? 0) + 32;
              const tx = to.position.x + (toRG?.position.x ?? 0) + 32;
              const ty = to.position.y + (toRG?.position.y ?? 0) + 32;
              const isSelected = selectedId === `${conn.from}-${conn.to}`;

              return (
                <g
                  key={`${conn.from}-${conn.to}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(`${conn.from}-${conn.to}`);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setConfig({
                      ...config,
                      connections: (config.connections ?? []).filter(
                        (c) => !(c.from === conn.from && c.to === conn.to)
                      ),
                    });
                    setSelectedId(null);
                  }}
                  style={{ pointerEvents: "auto", cursor: "pointer" }}
                >
                  <line
                    x1={fx}
                    y1={fy}
                    x2={tx}
                    y2={ty}
                    stroke={isSelected ? "blue" : "slategray"}
                    strokeWidth={2}
                    strokeDasharray={conn.type === "peering" ? "4 4" : "0"}
                  />
                </g>
              );
            })}

            {isDrawing && draggingFrom && (
              <line
                x1={
                  draggingFrom.position.x +
                  (modules.find((r) => r.id === draggingFrom.resourceGroup)?.position.x ?? 0) + 32
                }
                y1={
                  draggingFrom.position.y +
                  (modules.find((r) => r.id === draggingFrom.resourceGroup)?.position.y ?? 0) + 32
                }
                x2={mousePos.x}
                y2={mousePos.y}
                stroke="gray"
                strokeWidth={1}
                strokeDasharray="4"
              />
            )}
          </svg>
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
              {Object.entries(selectedModule.variables ?? {}).map(([key, value]) => {
                const schema = moduleVariableSchemas[selectedModule.type]?.[key];
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

                        const newName = key.toLowerCase().includes("name")
                          ? updatedValue
                          : selectedModule.name;

                        setSelectedModule({
                          ...selectedModule,
                          name: newName,
                          variables: updatedVariables,
                          error: error ?? undefined,
                        });
                      }}
                      className="w-full border rounded px-3 py-1"
                    />
                    {schema?.description && (
                      <p className="text-xs text-gray-500 mt-1">{schema.description}</p>
                    )}
                    {selectedModule.error && (
                      <p className="text-xs text-red-500">{selectedModule.error}</p>
                    )}
                  </div>
                );
              })}

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
