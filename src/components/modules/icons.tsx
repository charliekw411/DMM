import { IconType } from "react-icons";
import {
  MdDns,
  MdSecurity,
  MdOutlineRouter,
  MdOutlineStorage,
  MdCloud,
} from "react-icons/md";
import {
  FaNetworkWired,
  FaBox,
  FaShieldAlt,
  FaGlobe,
} from "react-icons/fa";

export const moduleIcons: Record<string, IconType> = {
  vnet: FaNetworkWired,
  subnet: MdDns,
  nsg: MdSecurity,
  firewall: FaShieldAlt,
  resourcegroup: FaBox,
  routetable: MdOutlineRouter,
  storage: MdOutlineStorage,
  cloud: MdCloud,
  publicip: FaGlobe,
};
