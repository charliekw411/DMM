"use client";

/**
 * Fixes:
 * 1. Form state now survives tab‑switches: PatternDetails initialises its local
 *    state from any existing `config` in context.
 * 2. ACCEPT sets the config and you immediately see the diagram update.
 * 3. Only ONE PatternDetails export now – remove duplicate external file.
 */

import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  GitBranch,
  Globe,
  Database,
  Shield as FirewallIcon,
  Server,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                              Shared Context                                */
/* -------------------------------------------------------------------------- */

type LandingZoneConfig = {
  tenantName: string;
  rootMG: string;
  subMGs: string;
  hubRegion: string;
  hubCIDR: string;
  firewallEnabled: boolean;
};

const defaultConfig: LandingZoneConfig = {
  tenantName: "Contoso",
  rootMG: "RootMG",
  subMGs: "Identity, Connectivity, Corp",
  hubRegion: "Australia East",
  hubCIDR: "10.0.0.0/16",
  firewallEnabled: false,
};

const LandingZoneContext = createContext<{
  config: LandingZoneConfig | null;
  setConfig: (c: LandingZoneConfig) => void;
}>({
  config: null,
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  setConfig: () => {},
});

const useLandingZone = () => useContext(LandingZoneContext);

const LandingZoneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<LandingZoneConfig | null>(null);
  return (
    <LandingZoneContext.Provider value={{ config, setConfig }}>
      {children}
    </LandingZoneContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                             PatternDetails UI                              */
/* -------------------------------------------------------------------------- */

const PatternDetails: React.FC = () => {
  const { config, setConfig } = useLandingZone();

  // 1️⃣  Initialise local form from existing config or defaults
  const [form, setForm] = useState<LandingZoneConfig>(config ?? defaultConfig);

  useEffect(() => {
    // Keep form in sync if config changes elsewhere
    if (config) setForm(config);
  }, [config]);

  const onChange =
    (field: keyof LandingZoneConfig) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: field === "firewallEnabled" ? (e.target as HTMLInputElement).checked : e.target.value,
      }));
    };

  const accept = () => {
    setConfig(form);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Infrastructure Pattern</h2>

      {/* Only Greenfield for brevity */}
      <div className="border rounded-lg p-4 hover:border-blue-500 transition-colors md:col-span-2">
        <div className="flex items-center mb-4">
          <GitBranch className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium">Greenfield Landing Zone</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            {["tenantName", "rootMG", "subMGs"].map((id) => (
              <div key={id}>
                <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
                  {id === "tenantName"
                    ? "Tenant Name"
                    : id === "rootMG"
                    ? "Root Management Group ID"
                    : "Sub‑Management Groups"}
                </label>
                <input
                  id={id}
                  value={form[id as keyof LandingZoneConfig] as string}
                  onChange={onChange(id as keyof LandingZoneConfig)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            {["hubRegion", "hubCIDR"].map((id) => (
              <div key={id}>
                <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
                  {id === "hubRegion" ? "Hub Region" : "Hub CIDR Range"}
                </label>
                <input
                  id={id}
                  value={form[id as keyof LandingZoneConfig] as string}
                  onChange={onChange(id as keyof LandingZoneConfig)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                id="fw-enabled"
                type="checkbox"
                checked={form.firewallEnabled}
                onChange={onChange("firewallEnabled")}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="fw-enabled" className="text-sm font-medium text-gray-700">
                Enable Azure Firewall
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={accept}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          ACCEPT
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                             NetworkDiagram UI                              */
/* -------------------------------------------------------------------------- */

const NetworkDiagram: React.FC = () => {
  const { config } = useLandingZone();
  const [vmOpen, setVmOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Architecture Diagram</h2>
      <div className="relative h-96 border-2 border-dashed border-gray-300 rounded-lg p-4">
        {config ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <div className="text-center text-lg font-medium">Tenant: {config.tenantName}</div>
            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col items-center">
                <Globe className="h-12 w-12 text-green-600" />
                <span className="mt-2 text-sm">Region: {config.hubRegion}</span>
              </div>
              <div className="flex flex-col items-center">
                <Database className="h-12 w-12 text-purple-600" />
                <span className="mt-2 text-sm">CIDR: {config.hubCIDR}</span>
              </div>
              <div className="flex flex-col items-center">
                <FirewallIcon className="h-12 w-12 text-red-600" />
                <span className="mt-2 text-sm">
                  Firewall: {config.firewallEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setVmOpen(true)}
              >
                <Server className="h-12 w-12 text-blue-600" />
                <span className="mt-2 text-sm">Configure VM</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Fill in the Greenfield Landing Zone and click ACCEPT to generate the diagram.
          </div>
        )}
      </div>

      {/* VM Modal */}
      {vmOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setVmOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-base font-semibold mb-4">VM Parameters</h4>
              {[
                { label: "Name", placeholder: "vm-prod-01" },
                { label: "Size / SKU", placeholder: "Standard_D2s_v5" },
                { label: "Operating System", placeholder: "Ubuntu 22.04" },
                { label: "Region", placeholder: config?.hubRegion ?? "Australia East" },
              ].map(({ label, placeholder }) => (
                <div key={label} className="mt-3 first:mt-0">
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    placeholder={placeholder}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>
              ))}
              <button
                onClick={() => setVmOpen(false)}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Page Wrapper                                 */
/* -------------------------------------------------------------------------- */

const LandingZonePage: React.FC = () => (
  <LandingZoneProvider>
    <PatternDetails />
    <NetworkDiagram />
  </LandingZoneProvider>
);

export default LandingZonePage;
