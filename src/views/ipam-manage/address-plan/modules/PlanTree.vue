<template>
  <div class="PlanTree">
    <VueTree
      style="height: 600px; border: 1px solid gray;"
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
  </div>
</template>

<script>
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
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
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