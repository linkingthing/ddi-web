import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

const initLayout = [
  {
    id: uuidv4(),
    name: "机构",
    nodes: []
  },
  {
    id: uuidv4(),
    name: "业务",
    nodes: []
  },
  {
    id: uuidv4(),
    name: "数据中心",
    nodes: []
  }
];

const state = {
  layoutList: [],
  currentLayoutId: "",
  currentLayout: {},
  currentNodeId: "",
  currentNode: {}
};

const getters = {
  currentNodeChildrenList: state => {
    console.log("currentNodeChildrenList", state.currentNode.nodes);
    return state.currentNode.nodes || [];
  }
};

const mutations = {
  setLayoutList(state, layoutList) {
    if (Array.isArray(layoutList)) {
      state.layoutList = layoutList;
    }
  },
  setCurrentLayoutId(state, currentLayoutId) {
    state.currentLayoutId = currentLayoutId;
  },
  setCurrentLayout(state, layout) {
    const _layout = _.cloneDeep(layout);
    if (layout) {
      _layout.expand = true;
      if (!layout.nodes) {
        _layout.nodes = _.cloneDeep(initLayout);
      }
    }
    state.currentLayout = _layout || {};
  },
  setCurrentNode(state, node) {
    state.currentNode = node;
  },
  setCurrentNodeChildrenList(state, currentNodeChildrenList) {
    state.currentNode.nodes = _.cloneDeep(currentNodeChildrenList);

    const layout = state.currentLayout;
    const currentNodeId = state.currentNode.id;
    const currentNode = findNodeById(layout, currentNodeId);
    currentNode.nodes = _.cloneDeep(currentNodeChildrenList);
  }
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};

function findNodeById(tree, id) {
  if (tree.id === id) {
    return tree;
  } else {
    return (
      Array.isArray(tree.nodes) &&
      tree.nodes.find(item => {
        return findNodeById(item, id);
      })
    );
  }
}
