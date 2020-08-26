<template>
  <div class="SemanticTree">
    <SemanticTreeHeader :prefix="prefix" />

    <Tree
      :data="[treeData]"
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
import { mapState, mapMutations } from "vuex";
import _ from "lodash";
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
      treeData: [],
      visible: false
    };
  },
  computed: {
    ...mapState({
      "layoutList": state => {
        return state.layout.layoutList;
      },
      "currentLayout": state => {
        return state.layout.currentLayout || {};
      }
    })

  },
  watch: {
    currentLayout: {
      deep: true,
      immediate: true,
      handler(val) {
        // console.log("watch")
        this.treeData = _.cloneDeep(val);
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "setCurrentNodeId"

    ]),
    handleSelectNode(nodes, node) {
      this.setCurrentNodeId(node.id);
    },
    renderContent(h, { root, node, data }) {
      // console.log("render tree", data)
      return h("span", {
        props: {
        },
        style: {
          display: "inline-block",
          width: "100%"
        }
      }, data.name);
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