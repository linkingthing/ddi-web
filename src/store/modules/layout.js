import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import {
  defaultBitWidth,
  getCurrentNode,
  executeTreeNodePrefix
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
    const currentNode = getCurrentNode(state) || {};
    return _.cloneDeep(currentNode).nodes || [];
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
  setCurrentLayout(state, data) {
    if (!data) {
      state.currentLayout = {};
      return;
    }
    let { layout, prefix } = data;
    const _layout = _.cloneDeep(layout);
    if (layout) {
      _layout.expand = true;
      _layout.bitWidth = defaultBitWidth;
      _layout.prefix = prefix;
      if (!layout.nodes) {
        const uuid = uuidv4();
        state.currentNodeId = uuid;
        _layout.nodes = [
          {
            expand: true,
            bitWidth: 0,
            id: uuid,
            ipv4: "",
            modified: 1,
            name: "layout",
            pid: "0",
            value: 0,
            nodes: _.cloneDeep(
              initLayout.map(item => {
                return {
                  ...item,
                  pid: uuid
                };
              })
            )
          }
        ];
      } else if (
        layout.nodes &&
        Array.isArray(layout.nodes) &&
        layout.nodes.length === 1
      ) {
        // console.log("_layout", _layout);
        // const node = _layout.nodes[0];
        // node.name = "layout";
        // node.nodes = _.cloneDeep(
        //   initLayout.map(item => {
        //     return {
        //       ...item,
        //       pid: node.id
        //     };
        //   })
        // );
        // _layout.nodes = [node];
      }
    }

    if (Array.isArray(_layout.nodes) && _layout.nodes.length) {
      let newTree = JSON.stringify(_layout);
      newTree = JSON.parse(newTree);

      let tree = newTree.nodes[0];
      tree.prefix = newTree.prefix;
      executeTreeNodePrefix([tree], "nodes");
      _layout.nodes[0] = tree;
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
    const layout = _.cloneDeep(state.currentLayout);
    state.currentLayout = layout;
  },
  setCurrentNodeIpv4(state, ipv4List) {
    const currentNode = getCurrentNode(state);
    currentNode.expand = true;
    currentNode.ipv4 = _.cloneDeep(ipv4List);
    const layout = _.cloneDeep(state.currentLayout);
    state.currentLayout = layout;
  },
  setCurrentNodeBitWidth(state, bitWidth) {
    const currentNode = getCurrentNode(state);
    currentNode.expand = true;
    currentNode.nodes.forEach(item => {
      item.bitWidth = bitWidth;
    });
  }
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
