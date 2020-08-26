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
    bitWidth: defaultBitWidth
  },
  {
    id: uuidv4(),
    name: "业务",
    nodes: [],
    bitWidth: defaultBitWidth
  },
  {
    id: uuidv4(),
    name: "数据中心",
    nodes: [],
    bitWidth: defaultBitWidth
  }
];

const state = {
  layoutList: [],
  currentLayoutId: "",
  currentLayout: {},
  currentNodeId: "", // 语义规划部分
  // currentTreeNodeId: "", // 地址段部分
  currentNode: {} // 目测可以不要
};

const getters = {
  currentNodeChildrenList: state => {
    return _.cloneDeep(getCurrentNode(state)).nodes || [];
  },
  currentNode: state => {
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
    currentNode.expand = true;
    currentNode.nodes = _.cloneDeep(currentNodeChildrenList);
  },
  setCurrentNodeBitWidth(state, bitWidth) {
    const currentNode = getCurrentNode(state);
    currentNode.expand = true;
    currentNode.bitWidth = bitWidth;
  },
  // setCurrentTreeNodeId(state, id) {
  //   state.currentTreeNodeId = id;
  // }
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
