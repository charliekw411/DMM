// src/components/tabs/ModulesTab.tsx
import React from "react";
import {
  Layers,
  Share2,
  Shield,
  LayoutGrid,
  Route,
} from "lucide-react";

const modules = [
  {
    type: "vnet",
    name: "Virtual Network",
    icon: <Layers className="h-6 w-6 text-green-600" />,
    fields: ["Name", "Address Space", "Region"],
  },
  {
    type: "subnet",
    name: "Subnet",
    icon: <Share2 className="h-6 w-6 text-blue-600" />,
    fields: ["Name", "Address Prefix", "Delegation"],
  },
  {
    type: "nsg",
    name: "Network Security Group",
    icon: <LayoutGrid className="h-6 w-6 text-yellow-600" />,
    fields: ["Name", "Inbound Rules", "Outbound Rules"],
  },
  {
    type: "firewall",
    name: "Azure Firewall",
    icon: <Shield className="h-6 w-6 text-red-600" />,
    fields: ["Name", "SKU", "IP Config"],
  },
  {
    type: "routeTable",
    name: "Route Table",
    icon: <Route className="h-6 w-6 text-purple-600" />,
    fields: ["Name", "Routes", "Subnet Association"],
  },
];

const ModulesTab: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Available Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <div
            key={mod.type}
            className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center mb-2">
              {mod.icon}
              <h3 className="ml-2 text-lg font-medium">{mod.name}</h3>
            </div>
            <ul className="text-sm text-gray-600 list-disc ml-6">
              {mod.fields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulesTab;
