<template>
  <div class="SemanticTree">
    <SemanticTreeHeader :prefix="prefix" />

    <Tree
      :data="layoutList"
      children-key="nodes"
      @on-select-change="handleSelectNode"
      :render="renderContent"
    />

    <Button
      type="primary"
      long
      @click="visible = true"
    > 语义规划完成</Button>

    <ChoosePlanWayModal :visible.sync="visible" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import SemanticTreeHeader from "./SemanticTreeHeader";
import ChoosePlanWayModal from "./ChoosePlanWayModal";

export default {
  components: {
    SemanticTreeHeader,
    ChoosePlanWayModal
  },
  props: {
    prefix: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      treeData: [{

        title: "parent 1",
        expand: true,
        children: [{
          title: "dassd",
          expand: true
        }, {
          title: "dassd",
          expand: true
        }, {
          title: "dassd",
          expand: true
        }, {
          title: "dassd",
          expand: true
        }]
      }],
      visible: false
    };
  },
  computed: {
    ...mapState([
      "layoutList"
    ]),
    ...mapGetters([
      "currentLayout"
    ])
  },
  watch: {
    layoutList: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(val)
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleSelectNode(nodes, node) {
      console.log(nodes, node)
    },
    renderContent(h, { root, node, data }) {
      console.log(data)
      return h("span", {
        style: {
          display: "inline-block",
          width: "100%"
        }
      },
        data.name
      );
    }


  }
};
</script>

<style lang="less" scoped>
.SemanticTree {
  width: 430px;
  background: #f6f6f6;
  border-radius: 4px;
  padding: 20px;
}
</style>