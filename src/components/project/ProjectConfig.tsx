import React from 'react';
import { Plus } from 'lucide-react';

const ProjectConfig = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Project Configuration</h2>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">PROJECT NAME</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subscription ID</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Naming Convention</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">IP Address Range / CIDR</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Environment</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>Dev</option>
            <option>Staging</option>
            <option>Production</option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tags</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">TAG A</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">TAG B</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <button type="button" className="flex items-center text-blue-600 hover:text-blue-700">
            <Plus className="h-4 w-4 mr-1" />
            Add more tags
          </button>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default ProjectConfig;