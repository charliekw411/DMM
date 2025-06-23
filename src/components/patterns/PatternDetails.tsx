import React from 'react';
import { Shield, Network, GitBranch } from 'lucide-react';

const PatternDetails = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Infrastructure Patterns</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* VNET and Firewall Pattern */}
        <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium">VNET and Firewall</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">IP Address Space</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">NSG</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Route Table</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Simple Infrastructure Pattern */}
        <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
          <div className="flex items-center mb-4">
            <Network className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium">Simple Infrastructure</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Azure Firewall Config</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" rows={4}></textarea>
            </div>
          </div>
        </div>

        {/* Greenfield Landing Zone Pattern (combined MG + Connectivity Hub) */}
        <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors md:col-span-2">
          <div className="flex items-center mb-4">
            <GitBranch className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium">Greenfield Landing Zone</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Column 1: Management Group hierarchy */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tenant Name</label>
                <input type="text" placeholder="Contoso" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Root Management Group ID</label>
                <input type="text" placeholder="RootMG" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sub‑Management Groups</label>
                <input type="text" placeholder="Identity, Connectivity, Corp" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>

            {/* Column 2: Connectivity hub details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hub Region</label>
                <input type="text" placeholder="Australia East" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hub CIDR Range</label>
                <input type="text" placeholder="10.0.0.0/16" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div className="flex items-center gap-2">
                <input id="fw-enabled" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="fw-enabled" className="text-sm font-medium text-gray-700">Enable Azure Firewall</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
        ACCEPT
      </button>
    </div>
  );
};

export default PatternDetails;
