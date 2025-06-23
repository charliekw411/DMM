import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import NetworkDiagram from './components/network/NetworkDiagram';
import PatternDetails from './components/patterns/PatternDetails';
import ProjectConfig from './components/project/ProjectConfig';

function App() {
  const [activeTab, setActiveTab] = useState('network');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('config')}
                className={`${
                  activeTab === 'config'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Project Details
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`${
                  activeTab === 'network'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Customisation Zone
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'network' && <NetworkDiagram />}
          {activeTab === 'patterns' && <PatternDetails />}
          {activeTab === 'config' && <ProjectConfig />}
        </div>
      </main>
    </div>
  );
}

export default App;