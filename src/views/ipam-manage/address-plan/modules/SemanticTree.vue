<template>
  <div class="SemanticTree">
    <SemanticTreeHeader :prefix="prefix" />

    <Tree
      :data="treeData"
      children-key="nodes"
      @on-select-change="handleSelectNode"
      :render="renderContent"
    />

    <Button
      type="primary"
      long
      @click="handleFinish"
    > 语义规划完成</Button>

    <ChoosePlanWayModal :visible.sync="visible" />
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from "vuex";
import _ from "lodash";
import SemanticTreeHeader from "./SemanticTreeHeader";
import ChoosePlanWayModal from "./ChoosePlanWayModal";
import { buildLayoutParams } from "./helper";

import Bus from "@/util/bus";

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
    ...mapGetters([
      "currentLayout"
    ])

  },
  watch: {
    currentLayout: {
      deep: true,
      immediate: true,
      handler(val) {
        this.treeData = _.cloneDeep(val.nodes);
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "setCurrentNodeId",
      "nextPlanStep"
    ]),
    handleSelectNode(nodes, node) {
      this.setCurrentNodeId(node.id);
    },
    renderContent(h, { root, node, data }) {
      return h("span", {
        props: {
        },
        style: {
          display: "inline-block",
          width: "100%"
        }
      }, [
        h("span", [
          h("Icon", {
            props: {
              type: "ios-paper-outline"
            },
            style: {
              marginRight: "8px"
            }
          }),
          h("span", data.name)
        ])
      ]);
    },
    handleFinish() {
      const { autofill } = this.currentLayout; // true, false, undefined

      if (typeof (autofill) === "undefined") {
        this.visible = true;
      } else if (autofill) {
        const params = buildLayoutParams(this.currentLayout);
        this.$put({ url: this.currentLayout.links.update, params }).then(() => {
          this.$get({ url: this.currentLayout.links.self }).then(res => {
            // 更新当前数据和状态
            this.nextPlanStep();
          });
        });
      } else {
        const params = buildLayoutParams(this.currentLayout, false);
        this.$put({ url: this.currentLayout.links.update, params }).then(() => {
          this.$get({ url: this.currentLayout.links.self }).then(res => {
            // 更新当前数据和状态
            this.nextPlanStep();
          });
        });
      }
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