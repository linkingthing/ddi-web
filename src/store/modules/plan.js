const planProcessList = [
  {
    title: "前缀设置",
    icon: "icon-process-prefix",
    type: "active",
    id: "PlanStepCreatePrefix"
  },
  {
    title: "语义规划",
    icon: "icon-process-plan",
    type: "",
    id: "PlanStepSemantic"
  },
  {
    title: "划分地址段",
    icon: "icon-process-branch",
    type: "",
    id: "PlanStepTree"
  },
  {
    title: "地址分配",
    icon: "icon-process-distribution",
    type: "",
    id: "PlanStepAddressAssign"
  }
];

const state = {
  planList: [],
  currentPlanId: "",
  planProcessList,
  currentPlanProcessId: "PlanStepCreatePrefix"
};

const getters = {
  planList: state => state.planList,
  currentPlan: state => {
    return state.planList.find(item => item.id === state.currentPlanId);
  },
  planProcessList: state => state.planProcessList,
  currentPlanProcessId: state => state.currentPlanProcessId
};

const mutations = {
  setPlanList(state, planList) {
    if (Array.isArray(planList)) {
      state.planList = planList;
    }
  },
  addPlan(state, plan) {
    state.planList.unshift(plan);
  },
  clearTempPlan(state, type = "temp") {
    state.planList = state.planList.filter(item => item.planType !== type);
  },
  setCurrentPlanId(state, currentPlanId) {
    state.currentPlanId = currentPlanId;
  },
  nextPlanStep(state, id) {
    if (id) {
      state.planProcessList.forEach(item => {
        if (item.id === id) {
          item.type = "active";
        } else if (item.type === "active") {
          item.type = "visited";
        }
      });
    } else {
      const currentPlanProcessIndex = state.planProcessList.findIndex(
        item => item.type === "active"
      );
      state.planProcessList[currentPlanProcessIndex].type = "visited";
      state.planProcessList[currentPlanProcessIndex + 1].type = "active";
    }
  },
  setCurrentPlanProcessId(state, id) {
    state.currentPlanProcessId = id;
  }
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
