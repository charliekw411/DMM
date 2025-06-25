// src/components/modules/utils.ts
import { Module } from "./types";
import { v4 as uuidv4 } from "uuid";

export const createVNetModule = (name: string, x = 100, y = 100): Module => ({
  id: uuidv4(),
  type: "vnet",
  name,
  position: { x, y }
});

export const createSubnetModule = (name: string, parentId: string, x = 150, y = 160): Module => ({
  id: uuidv4(),
  type: "subnet",
  name,
  position: { x, y },
  parentId
});

export const createFirewallModule = (name: string, parentId: string, x = 200, y = 140): Module => ({
  id: uuidv4(),
  type: "firewall",
  name,
  position: { x, y },
  parentId
});

export const createNSGModule = (name: string, parentId: string, x = 180, y = 120): Module => ({
  id: uuidv4(),
  type: "nsg",
  name,
  position: { x, y },
  parentId
});
