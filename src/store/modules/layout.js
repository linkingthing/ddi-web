import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import {
  defaultBitWidth,
  getCurrentNode
} from "@/views/ipam-manage/address-plan/modules/helper";

const initLayout = [
  {
    id: uuidv4(),
    name: "机构",
    nodes: [],
    bitWidth: defaultBitWidth,
    ipv4: "",
    modified: 1
  },
  {
    id: uuidv4(),
    name: "业务",
    nodes: [],
    bitWidth: defaultBitWidth,
    ipv4: "",
    modified: 1
  },
  {
    id: uuidv4(),
    name: "数据中心",
    nodes: [],
    bitWidth: defaultBitWidth,
    ipv4: "",
    modified: 1
  }
];

const state = {
  layoutList: [],
  currentLayoutId: "",
  currentLayout: {},
  currentNodeId: "" // 语义规划部分
};

const getters = {
  currentNodeChildrenList: state => {
    console.log("currentNodeChildrenList", getCurrentNode(state));
    const currentNode = getCurrentNode(state) || {};
    console.log(currentNode, 888);
    return _.cloneDeep(currentNode).nodes || [];
  },
  currentNode: state => {
    console.log("gettyer", getCurrentNode(state));

    return _.cloneDeep(getCurrentNode(state));
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
  setCurrentLayout(state, { layout, prefix }) {
    const _layout = _.cloneDeep(layout);

    if (layout) {
      _layout.expand = true;
      _layout.bitWidth = defaultBitWidth;
      _layout.prefix = prefix;
      if (!layout.nodes) {
        _layout.nodes = _.cloneDeep(
          initLayout.map(item => {
            return {
              ...item,
              pid: state.currentLayoutId
            };
          })
        );
      }
    }
    state.currentLayout = _layout || {};
  },
  setCurrentNodeId(state, id) {
    state.currentNodeId = id;
  },
  setCurrentNodeChildrenList(state, currentNodeChildrenList) {
    const currentNode = getCurrentNode(state);
    console.log("set", currentNode);

    currentNode.expand = true;
    currentNode.nodes = _.cloneDeep(currentNodeChildrenList);
  },
  setCurrentNodeBitWidth(state, bitWidth) {
    const currentNode = getCurrentNode(state);
    currentNode.expand = true;
    currentNode.bitWidth = bitWidth;
  }
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
