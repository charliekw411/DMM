import React from "react";
import {
  Layers,
  Share2,
  Shield,
  Flame,
  Route,
  Box,
} from "lucide-react";

// Individual icon components
export const VNetIcon: React.FC = () => (
  <Layers className="h-8 w-8 text-green-600" />
);

export const SubnetIcon: React.FC = () => (
  <Share2 className="h-8 w-8 text-blue-600" />
);

export const NSGIcon: React.FC = () => (
  <Shield className="h-8 w-8 text-purple-600" />
);

export const FirewallIcon: React.FC = () => (
  <Flame className="h-8 w-8 text-red-500" />
);

export const RouteTableIcon: React.FC = () => (
  <Route className="h-8 w-8 text-yellow-500" />
);

export const ResourceGroupIcon: React.FC = () => (
  <Box className="h-8 w-8 text-gray-600" />
);

// Map for use in ArchitectureDiagram
import { ModuleType } from "./types";

export const ICONS: Record<ModuleType, React.FC> = {
  vnet: VNetIcon,
  subnet: SubnetIcon,
  nsg: NSGIcon,
  firewall: FirewallIcon,
  routeTable: RouteTableIcon,
  resourceGroup: ResourceGroupIcon,
};
