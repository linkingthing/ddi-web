import { Address6 } from "ip-address";
import ipaddr from "ipaddr.js";

import _ from "lodash";
export const defaultBitWidth = 4;

export function buildLayoutParams(currentLayout, autofill = true) {
  const params = _.cloneDeep(currentLayout);

  // 自动value赋值
  if (autofill) {
    autoFillValue(params.nodes);
  }

  openModified(params.nodes); // TODO： 后期做局部跟新优化需要去掉

  autoSequence(params.nodes);

  const nodes = treeFlat(params.nodes);

  delete params.creationTimestamp;
  delete params.deletionTimestamp;
  delete params.expand;
  delete params.links;
  delete params.type;
  delete params.bitWidth;
  delete params.prefix;
  delete params.id;

  params.nodes = nodes;
  params.autofill = autofill;

  return params;
}

/**
 * 自动填充value
 */
function autoFillValue(tree) {
  if (Array.isArray(tree)) {
    tree.forEach((node, index) => {
      node.value = index + 1;
      node.modified = 1;
      autoFillValue(node.nodes);
    });
  }
}

function autoSequence(tree) {
  if (Array.isArray(tree)) {
    tree.forEach((node, index) => {
      node.sequence = index + 1;
      autoSequence(node.nodes);
    });
  }
}

/**
 * 解开modified
 */

export function openModified(tree) {
  if (Array.isArray(tree)) {
    tree.forEach((node, index) => {
      node.modified = 1;
      openModified(node.nodes);
    });
  }
}

export function findNodeById(tree, id, children = "nodes") {
  if (tree.id === id) {
    return tree;
  } else {
    if (Array.isArray(tree[children])) {
      for (const node of tree[children]) {
        const res = findNodeById(node, id);
        if (res) {
          return res;
        }
      }
    }
  }
}

/**
 * 查找当前状态树下的当前节点引用
 * 
*/
export function getCurrentNode(state) {
  const { layout } = state.planList.find(
    item => item.id === state.currentPlanId
  );
  const { currentNodeId } = layout;
  const currentNode = findNodeById(layout, currentNodeId);
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

/**
 * 树转换成列表
 * nodes
 */
export function treeFlat(tree, result = []) {
  if (tree && Array.isArray(tree)) {
    tree.forEach(({ nodes, ...node }) => {
      result.push(node);
      treeFlat(nodes, result);
    });
  }
  return result;
}

export function executeTreeNodePrefix(
  tree,
  autofill = false,
  children = "children"
) {
  if (Array.isArray(tree)) {
    tree.forEach(item => {
      const parentNodePrefix = item.prefix;
      if (Array.isArray(item[children]) && parentNodePrefix) {
        item[children].forEach((node, i) => {
          let offset = "";
          if (autofill) {
            offset = i + 1;
            node.prefix = executeNextIpv6Segment(
              parentNodePrefix,
              offset,
              node.bitWidth
            );
          } else {
            if (node.value) {
              offset = node.value;
              node.prefix = executeNextIpv6Segment(
                parentNodePrefix,
                offset,
                node.bitWidth
              );
            } else {
              node.prefix = "";
            }
          }
        });
      }
      executeTreeNodePrefix(item[children], autofill, children);
    });
  }
  return tree;
}

/**
 *
 */
export function list2Tree(data, pid) {
  let res = [];
  data.forEach(item => {
    if (item.pid === pid) {
      let itemChildren = list2Tree(data, item.id);
      if (itemChildren.length) item.nodes = itemChildren;
      item.expand = true;
      res.push(item);
    }
  });
  return res;
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
