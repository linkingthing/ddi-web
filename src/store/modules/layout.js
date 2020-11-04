import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import {
  getCurrentNode,
  findNodeById,
  executeTreeNodePrefix,
  list2Tree
} from "@/views/ipam-manage/address-plan/modules/helper";

const uuid = uuidv4();

const state = {
  prefix: "",
  planName: "",
  layout: {},
  nodes: [],
  currentNodeId: ""
};

const getters = {
  prefix: state => state.prefix,
  planName: state => state.planName,
  currentNodeId: state => state.currentNodeId,
  currentNode: state => {
    return state.nodes.find(item => item.id === state.currentNodeId);
  },
  tree: state => {
    return list2Tree(cloneDeep(state.nodes), "0");
  },
  nodes: state => state.nodes,
  currentNodeChildren: state => {
    return state.nodes.filter(item => item.pid === state.currentNodeId);
  }
};

const mutations = {
  setPlanName(state, planName) {
    state.planName = planName;
  },
  setPrefix(state, prefix) {
    state.prefix = prefix;
  },
  setNodes(state, nodes) {
    state.nodes = nodes;
  },
  initTree(state) {
    if (state.nodes.length) {
      state.nodes[0].name = state.planName;
      state.nodes[0].prefix = state.prefix;
      const { plannodes } = state.nodes[0];
      if (plannodes) {
        state.nodes[0].nextBitWidth = plannodes[0].bitWidth;
      }
    } else {
      state.nodes = [
        {
          expand: true,
          nextBitWidth: 0, // 下一级位宽
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
    state.currentNodeId = currentNodeId;
  },
  saveCurrentNode(state, currentNode) {
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
  addNodes(state, nodes) {
    state.nodes = [...state.nodes, ...nodes];
  }
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
