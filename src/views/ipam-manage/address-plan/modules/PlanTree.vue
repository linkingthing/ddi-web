<template>
  <div class="PlanTree">
    <VueTree
      style="min-height: 580px;"
      :dataset="treeData"
      :config="config"
      :active="active"
      direction="horizontal"
      link-style="straight"
    >
      <template v-slot:node="{ data, node, collapsed ,nodeDataList}">
        <div
          @click="handleSelectTreeNode(data, node, collapsed ,nodeDataList )"
          :class="{activeNode:data.id ===active.id, activeDepth: node.depth === active.depth }"
          class="rich-node"
          :style="{ border: collapsed ? '2px solid grey' : '' }"
        >

          <h3 class="name">{{ data.name }}</h3>
          <p class="ipv6">{{data.prefix}}</p>
          <div class="ipv4">ipv4</div>
        </div>
      </template>
    </VueTree>

    <div style="text-align:center;padding: 20px">
      <Button
        type="primary"
        @click="handleAddressPlanFinish"
      >地址段划分完成</Button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import VueTree from "@/components/vue-tree-chart";

import { treeEach, findNodeById, executeNextIpv6Segment } from "./helper";

export default {
  components: {
    VueTree
  },
  props: {},
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

      active: {}



    };
  },
  computed: {
    ...mapState({
      "currentLayout": state => state.layout.currentLayout
    },

    ),
    ...mapGetters([
      "currentNode"
    ])
  },
  watch: {
    "currentLayout": {
      deep: true,
      immediate: true,
      handler(val) {
        let newTree = JSON.stringify(val);
        newTree = newTree.replace(/nodes/g, "children");
        newTree = JSON.parse(newTree);

        newTree = treeEach(newTree, "children", (item, index) => {
          delete item.creationTimestamp;
          delete item.deletionTimestamp;
          delete item.expand;
          delete item.links;
          delete item.type;

          if (item.pid) {
            const parentNode = findNodeById(newTree, item.pid); // 这个函数的内部children会不会受影响？
            const parentNodePrefix = parentNode.prefix;
            item.prefix = executeNextIpv6Segment(parentNodePrefix, index + 1); // 位偏移，自定义需要调整
          }

        });

        this.treeData = newTree;
      }
    },
    "currentNode": {
      deep: true,
      immediate: true,
      handler(val) {


      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "nextPlanStep",
      "setCurrentNodeId"
    ]),
    handleSelectTreeNode(data, node, collapsed, nodeDataList) {
      // console.log(data, node, collapsed, nodeDataList)
      this.setCurrentNodeId(data.id);
      this.active = {
        id: data.id,
        depth: node.depth
      };
    },
    handleAddressPlanFinish() {
      this.nextPlanStep();
    }
  }
};
</script>

<style lang="less" scoped>
.PlanTree {
  flex: 1;

  .rich-node {
    width: 148px;
    height: 68px;
    text-align: center;
    background: #ededed;

    .name {
      font-size: 14px;
      font-weight: normal;
      color: #333;
    }
    .ipv6 {
    }
    .ipv4 {
    }
  }

  .activeNode{
    background: #4BC02F;
  }
  .activeDepth {
    box-shadow: 0 0 20px #f80;

  }
}
</style>