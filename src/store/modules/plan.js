import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import {
  defaultBitWidth,
  getCurrentNode,
  findNodeById,
  executeTreeNodePrefix,
  list2Tree
} from "@/views/ipam-manage/address-plan/modules/helper";

import { get } from "@/util/axios";
import { getApiByRoute } from "@/util/request";

const ProcessState = {
  ACTIVE: "active",
  VISITED: "visited",
  INIT: ""
};

function createPlanProcessList() {
  return [
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
}

function createInitLayout() {
  const initLayout = [
    {
      id: uuidv4(),
      name: "机构",
      nodes: [],
      bitWidth: "",
      ipv4: "",
      modified: 1
    },
    {
      id: uuidv4(),
      name: "业务",
      nodes: [],
      bitWidth: "",
      ipv4: "",
      modified: 1
    },
    {
      id: uuidv4(),
      name: "数据中心",
      nodes: [],
      bitWidth: "",
      ipv4: "",
      modified: 1
    }
  ];
  return initLayout;
}

function createPlan(item) {
  return {
    id: "",
    prefix: "",
    planProcessList: createPlanProcessList(),
    currentPlanProcessId: "PlanStepCreatePrefix",
    layout: {
      nodes: [],
      currentNodeId: "",
      netType: "",
      netNodes: []
    },
    ...item
  };
}

const state = {
  planList: [],
  currentPlanId: "",
  nettype: "netv6",
  netNodes: [],

  count: 1, // 触发计数器
  planCount: 1,
  layoutCount: 1
};

const getters = {
  planList: state => state.planList,
  currentPlanId: state => state.currentPlanId,
  currentPlan: state => {
    if (state.planCount) {
      return state.planList.find(item => item.id === state.currentPlanId);
    }
  },
  currentPrefix: state => {
    return state.planList.find(item => item.id === state.currentPlanId).prefix;
  },
  planProcessList: state =>
    state.planList.find(item => item.id === state.currentPlanId)
      .planProcessList,
  currentPlanProcessId: state =>
    state.planList.find(item => item.id === state.currentPlanId)
      .currentPlanProcessId,

  currentLayout: state => {
    if (state.layoutCount) {
      const plan = state.planList.find(item => item.id === state.currentPlanId);
      if (plan) {
        let _layout = plan.layout;

        // if (Array.isArray(_layout.nodes) && _layout.nodes.length) {
        //   console.log("plan");

        //   let newTree = JSON.stringify(_layout);
        //   newTree = JSON.parse(newTree);

        //   let tree = newTree.nodes[0];
        //   const autofill = _layout.autofill;
        //   tree.prefix = newTree.prefix;
        //   console.log("plan", tree, "autofill", autofill);

        //   executeTreeNodePrefix([tree], autofill, "nodes");
        //   _layout.nodes[0] = tree;
        // }
        return _layout;
      }
    }
  },
  currentNodeId: state => {
    if (state.count) {
      return state.planList.find(item => item.id === state.currentPlanId).layout
        .currentNodeId;
    }
  },
  currentNode: state => {
    if (state.count) {
      return _.cloneDeep(getCurrentNode(state));
    }
  },
  currentNodeChildrenList: state => {
    if (state.count) {
      const currentNode = getCurrentNode(state);
      return _.cloneDeep(currentNode).nodes || [];
    }
  },
  netType: state => state.nettype,
  netNodes: state => state.netNodes
};

const mutations = {
  setPlanList(state, planList) {
    if (Array.isArray(planList)) {
      state.planList = planList.map(item => {
        return createPlan(item);
      });
    }
    state.layoutCount++;
  },
  addPlan(state, plan) {
    state.planList.push(createPlan(plan));
  },
  clearTempPlan(state, type = "temp") {
    state.planList = state.planList.filter(item => item.planType !== type);
  },
  setCurrentPlanId(state, currentPlanId) {
    state.currentPlanId = currentPlanId;
    state.planCount++;
  },
  nextPlanStep(state, id) {
    const plan = state.planList.find(item => item.id === state.currentPlanId);
    const { planProcessList } = plan;

    if (id) {
      planProcessList.forEach(item => {
        if (item.id === id) {
          item.type = "active";
        } else if (item.type === "active") {
          item.type = "visited";
        }
      });
      plan.currentPlanProcessId = id;
    } else {
      const currentPlanProcessIndex = planProcessList.findIndex(
        item => item.type === "active"
      );
      planProcessList[currentPlanProcessIndex].type = "visited";
      planProcessList[currentPlanProcessIndex + 1].type = "active";
      plan.currentPlanProcessId =
        planProcessList[currentPlanProcessIndex + 1].id;
    }
  },

  setPlanProcessList(state, data) {
    state.planProcessList = planProcessList;
    const plan = state.planList.find(item => item.id === state.currentPlanId);
    let { planProcessList } = plan;
    planProcessList = data;
  },
  setPlanProcessListInit(state) {
    const plan = state.planList.find(item => item.id === state.currentPlanId);
    plan.planProcessList = createPlanProcessList();
  },
  setPlanProcessListAccessible(state, accessible) {
    const plan = state.planList.find(item => item.id === state.currentPlanId);
    let { planProcessList } = plan;
    planProcessList.forEach(item => {
      if (item.id === accessible) {
        if (item.type === "") {
          item.type = ProcessState.VISITED;
        }
      }
    });
  },
  setCurrentPlanProcessId(state, id) {
    const plan = state.planList.find(item => item.id === state.currentPlanId);
    plan.currentPlanProcessId = id;
  },

  setLayout(state, layout) {
    const _layout = _.cloneDeep(layout);
    if (_layout) {
      _layout.expand = true;
      _layout.bitWidth = defaultBitWidth;
      _layout.prefix = this.getters.currentPrefix;
      _layout.name = this.getters.currentPlan.description;

      if (Array.isArray(_layout.nodes)) {
        _layout.nodes = list2Tree(_layout.nodes, "0");
        if (_layout.nodes.length) {
          _layout.nodes[0].name = _layout.name;
        }
      }
      if (!_layout.nodes) {
        const uuid = uuidv4();
        state.currentNodeId = uuid;
        _layout.nodes = [
          {
            expand: true,
            bitWidth: 0,
            id: uuid,
            ipv4: "",
            modified: 1,
            name: _layout.name,
            pid: "0",
            value: 0,
            nodes: _.cloneDeep(
              createInitLayout().map(item => {
                return {
                  ...item,
                  pid: uuid
                };
              })
            )
          }
        ];
      }
    }

    state.planList.find(
      item => item.id === state.currentPlanId
    ).layout = _layout;

    state.layoutCount++;
  },

  setCurrentNodeId(state, id) {
    state.planList.find(
      item => item.id === state.currentPlanId
    ).layout.currentNodeId = id;
    state.count++;
  },

  setCurrentNodeChildrenList(state, currentNodeChildrenList) {
    const currentNode = getCurrentNode(state);
    currentNode.expand = true;
    currentNode.nodes = _.cloneDeep(currentNodeChildrenList);
    state.layoutCount++;
  },
  setCurrentNodeSiblingsList(state, currentNodeSiblingsList) {
    const { layout } = state.planList.find(
      item => item.id === state.currentPlanId
    );
    const currentNode = getCurrentNode(state);

    const parentNode = findNodeById(layout, currentNode.pid);
    parentNode.nodes = _.cloneDeep(currentNodeSiblingsList);
    state.layoutCount++;
  },
  setCurrentNodeIpv4(state, ipv4List) {
    const currentNode = getCurrentNode(state);
    currentNode.expand = true;
    currentNode.ipv4 = _.cloneDeep(ipv4List);
    state.count++;
    state.layoutCount++;
  },
  setCurrentNodeBitWidth(state, bitWidth) {
    const currentNode = getCurrentNode(state);
    currentNode.expand = true;
    if (Array.isArray(currentNode.nodes)) {
      currentNode.nodes.forEach(item => {
        item.bitWidth = bitWidth;
      });
    }
  },
  setNetType(state, netType) {
    state.nettype = netType;
  },
  setNetnodes(state, netNodes) {
    state.netNodes = netNodes;
  }
};

const actions = {
  getPlanList(context) {
    console.log("action");
    get(getApiByRoute("/address/ipam/plans")).then(data => {
      console.log(data);
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
