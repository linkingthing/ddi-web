import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import { list2Tree } from "@/views/ipam-manage/address-plan/modules/helper";
import router from "@/router";

import { get } from "@/util/axios";
const uuid = uuidv4();

const state = {
  prefixs: [],
  planName: "",
  layout: {},
  nodes: [],
  currentNodeId: "",
  hasChange: false
};

const getters = {
  prefixs: state => state.prefixs,
  planName: state => state.planName,
  currentNodeId: state => state.currentNodeId,
  currentNode: state => {
    return state.nodes.find(item => item.id === state.currentNodeId);
  },
  tree: state => {
    return list2Tree(cloneDeep(state.nodes), "0");
  },
  filterTree: state => {
    const smallTree = cloneDeep(state.nodes).filter(item => {
      return item.state !== "dispatch" || item.sponsordispatch;
    });
    return list2Tree(smallTree, "0");
  },
  nodes: state => state.nodes,
  allPlanNodes: state => {
    return state.nodes
      .map(item => item.plannodes || [])
      .reduce((prev, result) => {
        return result.concat(prev);
      }, []);
  },
  currentNodeChildren: state => {
    return state.nodes.filter(
      item => item.parentsemanticid === state.currentNodeId
    );
  },
  hasChange: state => state.hasChange
};

const mutations = {
  resetLayoutData(state) {
    state.prefix = "";
    state.planName = "";
    state.layout = {};
    state.nodes = [];
    state.currentNodeId = "";
  },
  setPlanName(state, planName) {
    state.planName = planName;
  },
  setPrefixs(state, prefixs) {
    state.prefixs = prefixs;
  },
  setNodes(state, nodes) {
    state.nodes = nodes;
  },
  initTree(state) {
    if (state.nodes.length) {
      state.nodes[0].name = state.planName;
      state.nodes[0].prefix = state.prefix;
    } else {
      state.nodes = [
        {
          expand: true,
          subnodebitwidth: 0, // 下一级位宽, 必须是数字,默认为0
          bitWidth: 0,
          id: uuid,
          ipv4: "",
          modified: 1,
          name: state.planName,
          pid: "0",
          value: 0,
          prefix: state.prefix,
          nodes: []
        }
      ];
    }
  },
  setCurrentNodeId(state, currentNodeId) {
    router.replace({
      query: { currentNodeId }
    });
    state.currentNodeId = currentNodeId;
  },
  // 传入node，有则修改，无则追加，所以叫save
  saveNode(state, currentNode) {
    const newNodes = [];
    state.nodes.forEach(node => {
      if (node.id === currentNode.id) {
        newNodes.push(currentNode);
      } else {
        newNodes.push(node);
      }
    });
    state.nodes = cloneDeep(newNodes);
  },
  saveNodes(state, nodes) {
    const newNodes = cloneDeep(state.nodes);
    nodes.forEach(function (node) {
      const index = newNodes.findIndex(item => {
        return item.id === node.id;
      });
      if (~index) {
        newNodes.splice(index, 1, node);
      } else {
        newNodes.push(node);
      }
    });
    state.nodes = cloneDeep(newNodes);
  },
  addNodes(state, nodes) {
    state.nodes = [...state.nodes, ...nodes];
  },
  removeNodeById(state, nodeId) {
    state.nodes = state.nodes.filter(item => item.id !== nodeId);
  },
  setHasChange(state, hasChange) {
    state.hasChange = hasChange;
  }
};

const actions = {
  getCurrentPlanInfo({ commit }, url) {
    get(url).then(({ name, prefixs, semanticnodes }) => {
      commit("setPlanName", name);
      commit("setPrefixs", prefixs);

      semanticnodes.forEach(node => {
        node.plannodes = node.plannodes || [];
        // 从plannodes节点中将prefix捞出，用于聚焦树节点时候面板展示
        const prefixArr = node.plannodes.reduce((result, plannode) => {
          return result.concat(plannode.prefix);
        }, []);
        node.prefixs = prefixArr;

        node.addressCount = node.plannodes.length;
      });

      commit("setNodes", semanticnodes);
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
