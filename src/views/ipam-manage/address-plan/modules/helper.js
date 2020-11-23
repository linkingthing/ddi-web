import { Address6 } from "ip-address";
import ipaddr from "ipaddr.js";

import _, { isNumber } from "lodash";
export const defaultBitWidth = 4;
import { v4 as uuidv4 } from "uuid";

export function buildLayoutParams(
  currentLayout,
  autofill = true,
  allValue = false
) {
  const params = _.cloneDeep(currentLayout);

  // 自动value赋值
  if (autofill) {
    autoFillValue(params.nodes);
  }

  if (allValue) {
    fillAllValue(params.nodes, allValue);
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

/**
 * 给每个节点填充value为负一
 */
function fillAllValue(tree, value) {
  if (Array.isArray(tree)) {
    tree.forEach((node, index) => {
      node.value = node.value || value;
      node.modified = 1;
      fillAllValue(node.nodes, value);
    });
  }
}

export function hasAllBitWidth(tree, isValid = true) {
  if (Array.isArray(tree)) {
    tree.forEach(node => {
      const isRoot = node.pid === "0";
      const hasBitWidth = isNumber(node.bitWidth) && node.bitWidth > 0;
      if (!isRoot && !hasBitWidth) {
        isValid = false;
      }
      isValid = hasAllBitWidth(node.nodes, isValid) && isValid;
    });
  }
  return isValid;
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
 * 计算位宽累加
 */
export function executeBitWidthSum(layout, currentNode, result = 0) {
  if (currentNode) {
    if (currentNode.prefix) {
      const [, len] = currentNode.prefix.split("/");
      return result + Number(len);
    } else {
      const parentNode = findNodeById(layout, currentNode.pid);
      result += Number(currentNode.bitWidth);
      return executeBitWidthSum(layout, parentNode, result);
    }
  }
}

/**
 * 获取树叶子节点
 */
export function getTreeLeaf(tree, result = []) {
  if (tree && Array.isArray(tree)) {
    tree.forEach(({ nodes, ...node }) => {
      const hasChildren = nodes && nodes.length > 0;
      if (!hasChildren) {
        result.push(node);
      }
      getTreeLeaf(nodes, result);
    });
  }
  return result;
}

/**
 * 获取有子节点的节点
 */
export function getTreeCrotch(tree, result = []) {
  if (tree && Array.isArray(tree)) {
    tree.forEach(({ nodes, ...node }) => {
      const hasChildren = nodes && nodes.length > 0;
      if (hasChildren) {
        result.push(node);
      }
      getTreeCrotch(nodes, result);
    });
  }
  return result;
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
            if (isNumber(node.value) && node.value !== -1) {
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
export function list2Tree(data, parentsemanticid, children = "nodes") {
  let res = [];
  data.forEach(item => {
    if (item.parentsemanticid === parentsemanticid) {
      let itemChildren = list2Tree(data, item.id, children);
      if (itemChildren.length) item[children] = itemChildren;
      item.expand = true;
      res.push(item);
    }
  });
  return res;
}

const ipv6ToBigInt = ip => {
  const ipArr = ipaddr.parse(ip).parts;
  let len = ipArr.length;
  // eslint-disable-next-line no-undef
  let bigNum = BigInt(0);
  for (let i = 0; i < len; i++) {
    // eslint-disable-next-line no-undef
    bigNum += BigInt(ipArr[i] * Math.pow(2, 2 * (len - i - 1) * 8));
  }
  return bigNum;
};

// n 偏移位数，默认为一
const excutePrefixIncrement = (ipv6BigInt, prefix, bitWidth, n = 1) => {
  // eslint-disable-next-line no-undef
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

/**
 * 计算ipv6，计算下一个ipv6地址段
 */
export function executeNextIpv6Segment(
  prefix,
  offset,
  bitWidth = defaultBitWidth
) {
  const ipv6 = new Address6(prefix);
  const { addressMinusSuffix, parsedSubnet } = ipv6;

  if (offset === -1) {
    return "";
  }
  return `${excuteNextIPv6(
    addressMinusSuffix,
    parsedSubnet,
    bitWidth,
    offset
  )}/${Number(parsedSubnet) + Number(bitWidth)}`;
}

export const binary = (nodecode, bitWidth) =>
  (Array(bitWidth).join("0") + nodecode.toString(2)).slice(-bitWidth);

export const parserValueStr2Arr = values => {
  const result = [];
  const arr = values.split(",");
  result.isValid = true;

  arr.forEach(item => {
    if (item.includes("-")) {
      let [start, end] = item.split("-");
      let time = end - start + 1;
      if (Number(time) > 0) {
        while (time--) {
          result.push(start++);
        }
      } else {
        result.isValid = false;
      }
    } else {
      result.push(+item);
    }
  });

  return result;
};

/**
 * 自动生成地址value值
 */
export const autoCreateAddressValue = (bitWidth, stepSize) => {
  const start = 1;
  const maxValue = 2 ** bitWidth - 1;
  const result = [];
  let currentValue = start;
  while (currentValue <= maxValue) {
    result.push(currentValue);
    currentValue += stepSize;
  }

  return result;
};

/**
 * 对semanticNodeList中的语义节点计算planNodes
 * selectSemanticNodeList 默认 为空，如果不为空，则只处理selectSemanticNodeList 里面的值
 * keepExistPlanNode true 时标识保持原来的PlanNodes不变（如果之前有）
 *
 */
export const planSemanticNodesValue = ({
  prefixList,
  semanticNodeList,
  bitWidth,
  stepSize,
  allPlanNodes,
  selectSemanticNodeList = [],
  keepExistPlanNode = true
}) => {
  const result = [];
  const availableValueList = executeValueRecyclePool(
    prefixList,
    semanticNodeList,
    bitWidth
  );
  let index = 0;
  semanticNodeList.forEach(semanticNode => {
    //  规划过的语义节点保持不变
    if (
      keepExistPlanNode &&
      Array.isArray(semanticNode.plannodes) &&
      semanticNode.plannodes.length
    ) {
      result.push(semanticNode);
      return;
    }

    const plannodes = Array.from({ length: stepSize }, () => {
      const { prefix, value } = availableValueList[index++];
      const parentPlanNode = allPlanNodes.find(
        item => item.prefix === prefix
      ) || { id: "0" };
      const parentplannodeid = parentPlanNode.id;
      return createPlanNode({
        prefix: executeNextIpv6Segment(prefix, value, bitWidth),
        value,
        semanticid: semanticNode.id,
        parentplannodeid,
        sequence: 1,
        name: "",
        bitWidth
      });
    });

    if (selectSemanticNodeList.length) {
      // 如果传入selectSemanticNodeList不为空，只更新选中部分

      const target = selectSemanticNodeList.find(
        selectNode => selectNode.id === semanticNode.id
      );
      if (target) {
        result.push({
          ...semanticNode,
          plannodes
        });
      } else {
        Array.from({ length: stepSize }, () => index--);
        result.push(semanticNode);
      }

      return;
    }

    result.push({
      ...semanticNode,
      plannodes
    });
  });

  return result;
};

/**
 * value回收池，计算可以使用的 [{ prefix, value }]
 * */
export const executeValueRecyclePool = (
  prefixList,
  semanticNodeList,
  bitWidth
) => {
  const result = [];
  const maxValue = 2 ** bitWidth - 2;
  const allValueList = prefixList
    .map(prefix => {
      return Array.from({ length: maxValue }, function (item, index) {
        return {
          prefix,
          realPrefix: executeNextIpv6Segment(prefix, index + 1, bitWidth),
          value: index + 1
        };
      });
    })
    .flat();

  // console.log(allValueList, "allValueList");
  const uesedValueList = semanticNodeList
    .map(semanticNode => {
      semanticNode.plannodes = semanticNode.plannodes || [];
      return semanticNode.plannodes.map(planNode => {
        return {
          prefix: planNode.prefix,
          value: planNode.value
        };
      });
    })
    .flat();

  // console.log(uesedValueList, "uesedValueList");

  allValueList.forEach(item => {
    const hasValue = uesedValueList.some(used => {
      return used.prefix === item.realPrefix && used.value === item.value;
    });
    if (!hasValue) {
      result.push(item);
    }
  });

  // console.log(result, "result");
  return result;
};

// executeValueRecyclePool(
//   ["32::/32", "33::/33"],
//   [{ plannodes: [{ prefix: "32::/32", value: 1 }] }],
//   4
// );

export const executeUesedValueList = semanticNodeList => {
  const uesedValueList = semanticNodeList
    .map(semanticNode => {
      semanticNode.plannodes = semanticNode.plannodes || [];
      return semanticNode.plannodes.map(planNode => {
        return {
          prefix: planNode.prefix,
          value: planNode.value
        };
      });
    })
    .flat();
  return uesedValueList;
};

export const hasAddressBlockToPlan = (bitWidth, semanticList) => {};

export const createSemanticNode = () => {
  return {
    id: uuidv4(),
    modified: 1,
    name: "语义节点1",
    parentsemanticid: "0",
    stepsize: 2,
    sequence: 1,
    autocreate: false,
    ipv4s: [],
    plannodes: []
  };
};

/**
 * 创建网络节点 planNode，定义结构避免参数情况
 */
export const createPlanNode = ({
  prefix,
  semanticid, // 当前节点的父节点（是一个语义节点）的id
  parentplannodeid,
  sequence,
  value,
  name,
  bitWidth
}) => {
  return {
    id: uuidv4(),
    prefix,
    semanticid,
    parentplannodeid, // 网络节点的上层网络节点
    sequence,
    value,
    name,
    bitWidth,
    maxmaskwidth: 64
  };
};

export const modifiedEnum = {
  NO: "no",
  STRUCTURED: "structured",
  INFO: "info"
};

export const planTypeEnum = {
  UNDEFINED: "undefined",
  ONEKEYPLAN: "oneKeyPlan",
  HANDLEPLAN: "handlePlan"
};

export const hasGrandson = (nodes, id) => {
  const children = nodes.filter(node => {
    return node.parentsemanticid === id;
  });
  if (children.length) {
    const grandsonIds = children.map(item => item.id);
    const grandson = nodes.find(node => {
      return grandsonIds.includes(node.parentsemanticid);
    });

    return !!grandson;
  } else {
    return false;
  }
};
