<template>
  <div class="SemanticTree">
    <SemanticTreeHeader
      :prefix="prefix"
      @search="handleSearch"
    />

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
import _, { cloneDeep } from "lodash";
import SemanticTreeHeader from "./SemanticTreeHeader";
import ChoosePlanWayModal from "./ChoosePlanWayModal";
import { buildLayoutParams, hasAllBitWidth, executeTreeNodePrefix } from "./helper";

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
      visible: false,
      keywords: ""
    };
  },
  computed: {
    ...mapGetters([
      "currentNodeId",
      "currentLayout"
    ])

  },
  watch: {
    currentLayout: {
      deep: true,
      immediate: true,
      handler(val) {
        this.treeData = _.cloneDeep(val.nodes);
        if (!this.currentNodeId) {
          this.setCurrentNodeId(val.nodes[0].id);
        }
      }
    }
  },
  created() { },
  mounted() {


  },
  methods: {
    ...mapMutations([
      "setCurrentNodeId",
      "nextPlanStep",
      "setLayout"
    ]),
    handleSearch(val) {
      this.keywords = val;
    },
    handleSelectNode(nodes, node) {
      this.setCurrentNodeId(node.id);
    },
    renderContent(h, { root, node, data }) {
      let name = transfer(data.name);
      const isSearch = this.keywords.length > 0 && data.name.includes(this.keywords);

      function transfer(str) {
        return str
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }


      if (isSearch) {
        name = name.split(this.keywords).join(`<span style="color: #f02828">${transfer(this.keywords)}</span>`);
      }

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
          h("span", {
            domProps: {
              innerHTML: name
            }
          })
        ])
      ]);
    },
    handleFinish() {

      const isValid = hasAllBitWidth(this.currentLayout.nodes);
      if (!isValid) {
        this.$Message.error("请检查设置节点位宽");
        return;
      }

      const { autofill } = this.currentLayout; // true, false, undefined
      if (typeof (autofill) === "undefined") {
        this.visible = true;
      } else if (autofill) {
        const params = buildLayoutParams(this.currentLayout);
        this.$put({ url: this.currentLayout.links.update, params }).then(() => {
          this.$get({ url: this.currentLayout.links.self }).then(res => {
            this.nextPlanStep();
            this.setLayout(res);
          });
        });
      } else {
        const layout = cloneDeep(this.currentLayout);
        executeTreeNodePrefix(layout.nodes, autofill, "nodes");
        const params = buildLayoutParams(layout, false);
        this.$put({ url: this.currentLayout.links.update, params }).then(() => {
          this.$get({ url: this.currentLayout.links.self }).then(res => {
            this.nextPlanStep();
            this.setLayout(res);
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