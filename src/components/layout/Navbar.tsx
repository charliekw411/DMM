import React from 'react';
import { Menu, Save, FileDown, FileImage, FileText, File } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Menu className="h-6 w-6 text-gray-700" />
              <span className="ml-2 font-semibold text-gray-800">MAIN MENU</span>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                MODULES
              </button>
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                PATTERNS
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              <Save className="h-4 w-4 mr-2" />
              Save Project
            </button>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </button>
              <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg hidden group-hover:block">
                <div className="py-1">
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Save as HTML
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Save as Text
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                    <File className="h-4 w-4 mr-2" />
                    Export as PDF
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                    <FileImage className="h-4 w-4 mr-2" />
                    Export as PNG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;