// types/patterns.ts

export type PatternType = "Greenfield" | "HubAndSpoke";

export interface BasePattern {
  id: string;
  type: PatternType;
  name: string;
  tenantID: string;
  tenantName: string;
  rootMG: string;
  mgGroupID: string;
  mgGroupName: string;
}

export interface GreenfieldPattern extends BasePattern {
  type: "Greenfield";
  hubRegion: string;
  hubCIDR: string;
  firewallEnabled: boolean;
}

export interface HubAndSpokePattern extends BasePattern {
  type: "HubAndSpoke";
  hubVNetName: string;
  hubCIDR: string;
  firewallEnabled: boolean;
  gatewayType: "VPN" | "ExpressRoute";
  spokes: { name: string; cidr: string; peered: boolean }[];

  // ✅ Add this line:
  position?: { x: number; y: number };
}

export type LandingZonePattern = GreenfieldPattern | HubAndSpokePattern;

export interface LandingZoneConfig {
  patterns: LandingZonePattern[];
  project: {
    tenantId: string;
    subscriptionId: string;
    environment: string;
    platform: "Azure" | "AWS" | "GCP" | "OnPrem";
    tags: Record<string, string>;
  };
}
