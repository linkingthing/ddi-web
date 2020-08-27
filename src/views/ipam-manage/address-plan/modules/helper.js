import { Address6 } from "ip-address";
import ipaddr from "ipaddr.js";

import _ from "lodash";
export const defaultBitWidth = 32;

export function findParentNodeById(tree, id) {
  if (tree.id === id) {
    return tree;
  } else {
    return (
      Array.isArray(tree.nodes) &&
      tree.nodes.find(item => {
        return findParentNodeById(item, id);
      })
    );
  }
}

export function findNodeById(tree, id) {
  if (tree.id === id) {
    return tree;
  } else {
    if (Array.isArray(tree.nodes)) {
      for (const node of tree.nodes) {
        const res = findNodeById(node, id);
        if (res) {
          return res;
        }
      }
    }
  }
}

export function getCurrentNode(state) {
  const layout = state.currentLayout;
  const currentNodeId = state.currentNodeId;
  var currentNode = findNodeById(layout, currentNodeId);
  return currentNode || {};
}

export function treeEach(tree, children, fn) {
  const _tree = _.cloneDeep(tree);
  fn(_tree);
  if (_tree[children] && Array.isArray(_tree[children])) {
    _tree[children].forEach(fn);
  }
  return _tree;
}

export function treeFlat(tree, result = []) {
  if (Array.isArray(tree.nodes)) {
    tree.nodes.forEach(({ nodes, ...node }) => {
      result.push(node);
      treeFlat(nodes, result);
    });
  }
  return result;
}

const ipv6ToBigInt = ip => {
  const ipArr = ipaddr.parse(ip).parts;
  let len = ipArr.length;
  let bigNum = BigInt(0);
  for (let i = 0; i < len; i++) {
    bigNum += BigInt(ipArr[i] * Math.pow(2, 2 * (len - i - 1) * 8));
  }
  return bigNum;
};

// n 偏移位数，默认为一
const excutePrefixIncrement = (ipv6BigInt, prefix, bitWidth, n = 1) => {
  return ipv6BigInt + BigInt(n * Math.pow(2, 128 - (prefix + bitWidth)));
};

const bigIntToIPv6 = bigInt => {
  const fullIPv6 = Address6.fromBigInteger(bigInt);
  return fullIPv6.correctForm();
};

// 计算下一个节点的IPv6起始
export const excuteNextIPv6 = (ip, prefix, subtreebitnum, n = 1) => {
  const bigNum = ipv6ToBigInt(ip);
  const newIpBigInt = excutePrefixIncrement(
    bigNum,
    Number(prefix),
    Number(subtreebitnum),
    n
  );
  return bigIntToIPv6(newIpBigInt);
};

export function executeNextIpv6Segment(
  prefix,
  offset,
  bitWidth = defaultBitWidth
) {
  const ipv6 = new Address6(prefix);
  const { addressMinusSuffix, parsedSubnet } = ipv6;
  return `${excuteNextIPv6(
    addressMinusSuffix,
    parsedSubnet,
    bitWidth,
    offset
  )}/${Number(parsedSubnet) + Number(bitWidth)}`;
}

export const binary = (nodecode, bitWidth) =>
  (Array(bitWidth).join("0") + nodecode.toString(2)).slice(-bitWidth);
