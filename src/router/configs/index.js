import accessControl from "./access-control";
import dhcp from "./dhcp";
import dns from "./dns";
import ipam from "./ipam";
import node from "./node";
import systemSafe from "./system-safe";
import forword from "./forward";

let res = [
  node,
  ipam,
  dns,
  forword,
  accessControl,
  dhcp,
  systemSafe
];

res.forEach(item => {
  if (!item.meta) {
    item.meta = {};
  }

  item.children && item.children.forEach(child => {
    if (!child.meta) {
      child.meta = {};
    }
  });
});

export default res;