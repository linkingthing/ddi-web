<template>
  <div class="SemanticTree">
    <SemanticTreeHeader prefix="语义树" />
    <div class="tree">
      <Tree
        :data="treeData"
        children-key="nodes"
        @on-select-change="handleSelectNode"
        :render="renderContent"
      />
    </div>

  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from "vuex";
import { cloneDeep } from "lodash";
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
      "tree",
      "hasChange"
    ])

  },
  watch: {
    tree: {
      deep: true,
      immediate: true,
      handler(val) {
        // console.log(val, "tree")
        if (Array.isArray(val) && val.length) {
          this.treeData = cloneDeep(val);
          if (!this.currentNodeId) {
            this.setCurrentNodeId(val[0].id);
          }
        }
      }
    }

  },
  created() { },
  mounted() {
  },
  methods: {
    ...mapMutations([
      "initTree",
      "setCurrentNodeId"
    ]),

    handleSelectNode(nodes, node) {
      // console.log("handleSelectNode", node, this.currentNodeId)
      if (node.id !== this.currentNodeId) {
        if (this.hasChange) {
          this.$Message.info("请先保存再切换节点");
          return;
        }
        this.setCurrentNodeId(node.id);
      }
    },
    renderContent(h, { root, node, data }) {
      // data.selected = true;
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
        class: {
          "ivu-tree-title-selected": data.id === this.currentNodeId
        },
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
    }

  }
};
</script>

<style lang="less" scoped>
.SemanticTree {
  width: 330px;
  background: #f4f4f4;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  .tree {
    padding: 20px;
    overflow: auto;
  }
}
</style>