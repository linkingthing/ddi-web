import { Address6 } from "ip-address";

import _ from "lodash";
export const defaultBitWidth = 4;

export function treeEach(tree, fn) {
  const _tree = _.cloneDeep(tree);
  fn(_tree);
  if (_tree.nodes && Array.isArray(_tree.nodes)) {
    _tree.nodes.forEach(item => {
      fn(item);
    });
  }
  return _tree;
}




export function executeNextIpv6Segment(prefix, bitWidth = defaultBitWidth, offset) {
  const prefixLeft = prefix.split("/");
}
const prefix = "2001:503::/32";
const ipv6 = new Address6(prefix);
console.log(Address6)
console.log(ipv6)