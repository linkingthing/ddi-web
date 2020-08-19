const state = {
  planList: [],
  currentPlanId: "",

};

const getters = {
  currentPlan: state => {
    return state.planList.find(item => item.id === state.currentPlanId);
  },
 
};

const mutations = {
  setPlanList(state, planList) {
    state.planList = planList;
  },
  setCurrentPlanId(state, userType) {
    state.userType = userType;
  },
 
};

const actions = {
 
};

export default {
  state,
  getters,
  mutations,
  actions
};
