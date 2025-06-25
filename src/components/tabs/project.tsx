import React from "react";
import { useApp } from "../context/appContext";

const ProjectTab: React.FC = () => {
  const { config, setConfig } = useApp();

  const update = (key: string, value: any) => {
    setConfig({
      ...config,
      project: {
        ...config.project,
        [key]: value,
      },
    });
  };

  const updateTag = (index: number, key: "name" | "value", value: string) => {
    const updatedTags = [...(config.project?.tags ?? [])];
    updatedTags[index][key] = value;
    update("tags", updatedTags);
  };

  const addTag = () => {
    const updatedTags = [...(config.project?.tags ?? []), { name: "", value: "" }];
    update("tags", updatedTags);
  };

  const removeTag = (index: number) => {
    const updatedTags = [...(config.project?.tags ?? [])];
    updatedTags.splice(index, 1);
    update("tags", updatedTags);
  };

  const tags = Array.isArray(config.project?.tags) ? config.project.tags : [];

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-6">Project Configuration</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Tenant ID</label>
          <input
            type="text"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            value={config.project?.tenantId ?? ""}
            onChange={(e) => update("tenantId", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subscription ID</label>
          <input
            type="text"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            value={config.project?.subscriptionId ?? ""}
            onChange={(e) => update("subscriptionId", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Platform</label>
          <select
            value={config.project?.platform ?? ""}
            onChange={(e) => update("platform", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Platform</option>
            <option value="azure">Azure</option>
            <option value="aws">AWS</option>
            <option value="gcp">GCP</option>
            <option value="onprem">On-Premises</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Environment</label>
          <select
            value={config.project?.environment ?? ""}
            onChange={(e) => update("environment", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Environment</option>
            <option value="dev">Development</option>
            <option value="test">Testing</option>
            <option value="prod">Production</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Tags</h3>
          <button
            onClick={addTag}
            className="text-blue-600 text-sm hover:underline"
          >
            + Add Tag
          </button>
        </div>

        {tags.map((tag, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Name"
              className="border rounded px-2 py-1 w-1/2"
              value={tag.name}
              onChange={(e) => updateTag(i, "name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              className="border rounded px-2 py-1 w-1/2"
              value={tag.value}
              onChange={(e) => updateTag(i, "value", e.target.value)}
            />
            <button
              onClick={() => removeTag(i)}
              className="text-red-500 text-sm hover:underline"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTab;
