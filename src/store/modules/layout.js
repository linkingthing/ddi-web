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
  allPlanNodes: state => {
    return state.nodes
      .map(item => item.plannodes || [])
      .reduce((prev, result) => {
        return result.concat(prev);
      }, []);
  },
  currentNodeChildren: state => {
    return state.nodes.filter(item => item.parentsemanticid === state.currentNodeId);
  }
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
    } else {
      state.nodes = [
        {
          expand: true,
          nextBitWidth: 0, // 下一级位宽, 必须是数字,默认为0
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
