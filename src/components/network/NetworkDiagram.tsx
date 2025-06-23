"use client";

import React from 'react';
import { Server, Shield, Globe, Database } from 'lucide-react';

// NOTE: original import block preserved; no extra libraries added.

const NetworkDiagram = () => {
  /**
   * State controlling whether the VM‑configuration modal is visible.
   */
  const [vmOpen, setVmOpen] = React.useState(false);

  const closeVm = () => setVmOpen(false);
  const openVm = () => setVmOpen(true);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Network Diagram</h2>

      {/* ───────────────────────── Diagram Canvas ───────────────────────── */}
      <div className="relative h-96 border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="grid grid-cols-2 gap-8">
            {/* ─── Virtual Machine ────────────────────────────────────────── */}
            <div className="flex flex-col items-center select-none cursor-pointer" onClick={openVm}>
              <Server className="h-12 w-12 text-blue-600" />
              <span className="mt-2 text-sm">Virtual Machine</span>
            </div>

            {/* Firewall */}
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-red-600" />
              <span className="mt-2 text-sm">Firewall</span>
            </div>

            {/* Load Balancer */}
            <div className="flex flex-col items-center">
              <Globe className="h-12 w-12 text-green-600" />
              <span className="mt-2 text-sm">Load Balancer</span>
            </div>

            {/* Database */}
            <div className="flex flex-col items-center">
              <Database className="h-12 w-12 text-purple-600" />
              <span className="mt-2 text-sm">Database</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────── Modal Overlay ────────────────────────── */}
      {vmOpen && (
        <>
          {/* Darken background */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeVm}
            aria-hidden="true"
          />

          {/* Centered modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-base font-semibold mb-4">VM Parameters</h4>

              {[
                { id: 'name', label: 'Name', placeholder: 'vm-prod-01' },
                { id: 'size', label: 'Size / SKU', placeholder: 'Standard_D2s_v5' },
                { id: 'os', label: 'Operating System', placeholder: 'Ubuntu 22.04' },
                { id: 'region', label: 'Region', placeholder: 'Australia East' },
              ].map(({ id, label, placeholder }) => (
                <div key={id} className="mt-3 first:mt-0">
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>
              ))}

              <button
                onClick={closeVm}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {/* ───────────────────────── Peering Details ──────────────────────── */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">PEERING DETAILS</h3>
        <div className="space-y-4">
          {['A', 'B', 'C'].map((letter) => (
            <div key={letter}>
              <label
                htmlFor={`detail-${letter}`}
                className="block text-sm font-medium text-gray-700"
              >
                Detail {letter}
              </label>
              <input
                id={`detail-${letter}`}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkDiagram;
