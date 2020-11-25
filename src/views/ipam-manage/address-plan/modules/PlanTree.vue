<template>
  <div class="PlanTree">
    <VueTree
      style="min-height: calc(100vh - 140px);"
      :dataset="treeData"
      :config="config"
      direction="horizontal"
      link-style="straight"
    >
      <template v-slot:node="{ data, node, collapsed ,nodeDataList}">
        <div
          @click="handleSelectTreeNode(data, node, collapsed ,nodeDataList )"
          :class="{activeNode:data.id ===active.id, activeDepth: active.siblingsId.includes(data.id)}"
          class="rich-node"
          :style="{ border: collapsed ? '2px solid grey' : '' }"
        >

          <h3 class="name">{{ data.name }}</h3>
          <div v-if="Array.isArray(data.planchildren)">
            <p
              class="s-ipv6"
              :key="ipv6"
              v-for="ipv6 in data.planchildren.map(item => item.prefix)"
            >{{ ipv6 }}</p>
          </div>

          <div v-if="Array.isArray(data.ipv4s)">
            <p
              class="s-ipv6"
              :key="ipv4s"
              v-for="ipv4s in data.ipv4s"
            >{{ ipv4s }}</p>
          </div>
        </div>

      </template>
    </VueTree>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapGetters } from "vuex";
import VueTree from "@/components/vue-tree-chart";

import { buildLayoutParams, executeTreeNodePrefix } from "./helper";
import { v4 as uuidv4 } from "uuid";

import { ipv4IsValid, isIpv4Segment } from "@/util/common";

export default {
  components: {
    VueTree
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      treeData: {
        name: "g",
        children: [{
          name: "123"
        }, {
          name: "123"
        }, {
          name: "123"
        }]
      },
      config: {
        nodeWidth: 148,
        nodeHeight: 68,
        levelHeight: 200
      },

      active: {
        siblingsId: []
      },


      visible: false,
      currentIpv4List: ""


    };
  },
  computed: {
 
  },
  watch: {
    data: {
      deep: true,
      handler([val]) {
        let newTree = JSON.stringify(val);
        newTree = newTree.replace(/nodes/g, "children");
        newTree = JSON.parse(newTree);
        this.treeData = newTree;
      }
    },
    // "currentLayout": {
    //   deep: true,
    //   // immediate: true,
    //   handler(val) {
    //     let newTree = JSON.stringify(val);
    //     newTree = newTree.replace(/nodes/g, "children");
    //     newTree = JSON.parse(newTree);

    //     if (Array.isArray(newTree.children) && newTree.children.length) {
    //       let tree = newTree.children[0];
    //       tree.prefix = newTree.prefix;

    //       // 是否需要计算 prefix，,手动规划情况，且规划到位的才设置prefix

    //       if (_.isBoolean(val.autofill) && !val.autofill) {
    //         executeTreeNodePrefix([tree]);
    //       }
    //       // this.treeData = tree;
    //     }
    //   }
    // }
  },
  created() { },
  mounted() { },
  methods: {

    handleSelectTreeNode(data, node, collapsed, nodeDataList) {
      console.log(data)
    },


  }
};
</script>

<style lang="less" scoped>
.PlanTree {
  flex: 1;
  overflow: hidden;

  .rich-node {
    display: flex;
    justify-content: center;
    // align-items: center;
    flex-direction: column;
    padding: 4px 8px;

    width: 148px;
    text-align: left;
    background: #ededed;
    border-radius: 4px;

    .name {
      font-size: 14px;
      font-weight: normal;
      color: #333;
    }
    .s-ipv6 {
      font-size: 12px;
    }
    .ipv4 {
    }
  }

  .activeNode {
    // background: #4bc02f;
  }
  .activeDepth {
    background: #a7d0f3;
  }
}
</style>