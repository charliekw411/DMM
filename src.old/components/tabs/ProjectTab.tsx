import React from "react";
import { useLandingZone } from "../context/LandingZonesContext";

const ProjectTab: React.FC = () => {
  const { config, setConfig } = useLandingZone();

  const update = <K extends keyof typeof config.project>(
    key: K,
    value: typeof config.project[K]
  ) => {
    setConfig({
      ...config,
      project: {
        ...config.project,
        [key]: value,
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Project Settings</h2>

      <div className="grid grid-cols-1 gap-4">
        <input
          placeholder="Tenant ID"
          value={config.project.tenantId}
          onChange={(e) => update("tenantId", e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Subscription ID"
          value={config.project.subscriptionId}
          onChange={(e) => update("subscriptionId", e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          placeholder="Naming Convention"
          value={config.project.namingConvention}
          onChange={(e) => update("namingConvention", e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={config.project.platform}
          onChange={(e) =>
            update("platform", e.target.value as typeof config.project.platform)
          }
          className="w-full border rounded px-3 py-2"
        >
          <option value="azure">Azure</option>
          <option value="aws">AWS</option>
          <option value="gcp">GCP</option>
          <option value="onprem">On-Prem</option>
        </select>
        <textarea
          placeholder="Tags (JSON format)"
          value={JSON.stringify(config.project.tags, null, 2)}
          onChange={(e) => {
            try {
              update("tags", JSON.parse(e.target.value));
            } catch {
              // Optional: show error or skip update
            }
          }}
          className="w-full border rounded px-3 py-2 font-mono text-sm"
          rows={4}
        />
      </div>
    </div>
  );
};

export default ProjectTab;