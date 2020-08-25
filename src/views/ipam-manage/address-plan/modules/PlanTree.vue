<template>
  <div class="PlanTree">
    <VueTree
      style="min-height: 580px;"
      :dataset="treeData"
      :config="config"
      direction="horizontal"
      link-style="straight"
    >
      <template v-slot:node="{ data, node, collapsed ,nodeDataList}">
        <div
          @click="handleSelectTreeNode(data, node, collapsed ,nodeDataList )"
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
import { mapState, mapMutations } from "vuex";
import VueTree from "@/components/vue-tree-chart";

import { treeEach } from "./helper";

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
      }

    };
  },
  computed: {
    ...mapState({
      "currentLayout": state => state.layout.currentLayout

    }
    )
  },
  watch: {
    "currentLayout": {
      deep: true,
      immediate: true,
      handler(val) {
        console.log("currentLayout", val)
        let newTree = JSON.stringify(val);
        newTree = newTree.replace(/nodes/g, "children");
        newTree = JSON.parse(newTree);
        console.log("newTree", newTree)

        newTree = treeEach(newTree, item => {
          delete item.creationTimestamp;
          delete item.deletionTimestamp;
          delete item.expand;
          delete item.links;
          delete item.type;
        });
        console.log("newTree", newTree)

        this.treeData = newTree;
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "nextPlanStep"
    ]),
    handleSelectTreeNode(data, node, collapsed, nodeDataList) {
      console.log(data, node, collapsed, nodeDataList)
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
}
</style>