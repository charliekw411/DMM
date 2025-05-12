import React from 'react';
import { Server, Shield, Globe, Database } from 'lucide-react';

const NetworkDiagram = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Network Diagram</h2>
      <div className="relative h-96 border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <Server className="h-12 w-12 text-blue-600" />
              <span className="mt-2 text-sm">Virtual Machine</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-red-600" />
              <span className="mt-2 text-sm">Firewall</span>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-12 w-12 text-green-600" />
              <span className="mt-2 text-sm">Load Balancer</span>
            </div>
            <div className="flex flex-col items-center">
              <Database className="h-12 w-12 text-purple-600" />
              <span className="mt-2 text-sm">Database</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">PEERING DETAILS</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Detail A</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Detail B</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Detail C</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkDiagram;