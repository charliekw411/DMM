import React, { useState } from "react";
import { useApp } from "../context/appContext";
import { loadedModules } from "../modules/loadModules";
import { v4 as uuid } from "uuid";
import { createModule } from "../modules/utils";
import ModuleConfigModal from "../common/ModuleConfigModal";
import { moduleIcons } from "../modules/icons";

const ModulesTab: React.FC = () => {
  const { config, setConfig } = useApp();
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = (values: Record<string, string>) => {
  if (!selectedModule) return;

  const baseX = 100;
  const baseY = 100;

  if (selectedModule.createBundle) {
    // If module is a mini-pattern (e.g., Firewall)
    const { modules, connections } = selectedModule.createBundle(baseX, baseY, values);

    setConfig({
      ...config,
      modules: [...config.modules, ...modules],
      connections: [...(config.connections ?? []), ...connections],
    });
  } else {
    const newId = uuid();
    const created = createModule(selectedModule.type, newId, baseX, baseY, values);

    const nameKey = Object.keys(values).find((k) => k.toLowerCase().includes("name"));
    const updatedName = nameKey ? values[nameKey] : selectedModule.name;

    setConfig({
      ...config,
      modules: [
        ...config.modules,
        {
          ...created,
          id: newId,
          name: updatedName,
        },
      ],
    });
  }

  setSelectedModule(null);
  setShowModal(false);
};


  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Modules</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loadedModules.map((mod) => {
          const Icon = moduleIcons[mod.type] || (() => <div className="text-gray-400">?</div>);

          return (
            <button
              key={mod.type}
              onClick={() => {
                setSelectedModule(mod);
                setShowModal(true);
              }}
              className="border rounded-lg p-4 hover:bg-gray-100 text-center"
            >
              <div className="text-3xl mb-2 flex justify-center">
                <Icon />
              </div>
              <div className="font-medium">{mod.name}</div>
            </button>
          );
        })}
      </div>

      {showModal && selectedModule?.variableSchema && (
        <ModuleConfigModal
          title={`Configure ${selectedModule.name}`}
          schema={selectedModule.variableSchema}
          initialValues={selectedModule.initialVariables ?? {}}
          onSubmit={handleCreate}
          onCancel={() => {
            setSelectedModule(null);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ModulesTab;
