import accessControl from "./access-control";
import dhcp from "./dhcp";
import dns from "./dns";
import dnsGlobalConfig from "./dns-global-config";
import ipam from "./ipam";
import node from "./node";
import forword from "./forward";
import systemAlarms from "./system-alarms";
import systemLog from "./system-log";
import systemLinkage from "./system-linkage";
import authControl from "./auth-control";

const constRouter = [
  node,
  ipam,
  dns,
  forword,
  accessControl,
  dhcp
];

const superUserRouter = [
  // node,
  systemLog,
  systemAlarms,
  dnsGlobalConfig,
  authControl,
  systemLinkage
];

function addMeta(arr) {
  arr.forEach(item => {
    if (!item.meta) {
      item.meta = {};
    }

    item.children &&
      item.children.forEach(child => {
        if (!child.meta) {
          child.meta = {};
        }
      });
  });
  return arr;
}

export default addMeta(constRouter);

export const asyncRouter = addMeta(superUserRouter);

export const allConfig = [...addMeta(constRouter), ...asyncRouter];

export const superUserAllowList = [
  "DNSDashboard",
  "DHCPDashboard",
  "ControllerDashboard",

  "global-config-content",
  "global-config",
  "concurrency-control",

  "system-log",
  "system-alarms",
  "operate-logs",
  "parse-logs",

  "alarm-config",
  "alarm-notice",
  "alarm-info",

  "auth-user",
  "auth-user-group",
  "auth-user-list",
  "auth-role-list"
];
