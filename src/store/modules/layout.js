const state = {
  layoutList: [],
  currentLayoutId: ""
};

const getters = {
  currentLayout: state => {
    return state.layoutList.find(item => item.id === state.currentLayoutId);
  }
};

const mutations = {
  setLayoutList(state, layoutList) {
    console.log(layoutList)
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
