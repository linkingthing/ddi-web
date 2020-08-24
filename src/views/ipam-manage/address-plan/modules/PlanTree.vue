<template>
  <div class="PlanTree">
    <VueTree
      style="min-height: 580px;"
      :dataset="treeData"
      :config="config"
      direction="horizontal"
      link-style="straight"
    >
      <template v-slot:node="{ node, collapsed }">
        <div
          class="rich-node"
          :style="{ border: collapsed ? '2px solid grey' : '' }"
        >

          <span style="padding: 4px 0; font-weight: bold;">{{ node.name }}</span>
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
        this.treeData = val;
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "nextPlanStep"
    ]),

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
    background: #ededed;
  }
}
</style>