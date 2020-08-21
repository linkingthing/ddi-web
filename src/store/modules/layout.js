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
  currentLayoutId: ""
};

const getters = {
  currentLayout: state => {
    const layout = state.layoutList.find(
      item => item.id === state.currentLayoutId
    );
    const _layout = _.cloneDeep(layout);

    if (layout) {
      _layout.nodeKey = null;

      _layout.expand = true;
      if (!layout.nodes) {
        _layout.nodes = _.cloneDeep(initLayout);
      }
    }

    return _layout || {};
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
  }
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
