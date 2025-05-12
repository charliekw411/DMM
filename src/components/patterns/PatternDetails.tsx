import React from 'react';
import { Shield, Network } from 'lucide-react';

const PatternDetails = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Infrastructure Patterns</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
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
      </div>

      <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
        ACCEPT
      </button>
    </div>
  );
};

export default PatternDetails;