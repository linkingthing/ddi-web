import accessControl from "./access-control";
import dhcp from "./dhcp";
import dns from "./dns";
import dnsGlobalConfig from "./dns-global-config";
import ipam from "./ipam";
import node from "./node";
import forword from "./forward";
import systemAlarms from "./system-alarms";
import systemLog from "./system-log";
import authControl from "./auth-control";

let res = [
  node,
  ipam,
  dns,
  forword,
  accessControl,
  dnsGlobalConfig,
  dhcp,
  systemLog,
  systemAlarms,
  authControl
];

res.forEach((item) => {
  if (!item.meta) {
    item.meta = {};
  }

  item.children &&
    item.children.forEach((child) => {
      if (!child.meta) {
        child.meta = {};
      }
    });
});

export default res;
