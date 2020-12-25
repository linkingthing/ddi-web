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
import eventBus from "@/util/bus";

import ableReport from "./able-report.png";
import alreadyDispatch from "./already-dispatch.png";

export default {
  components: {
    SemanticTreeHeader
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
      "hasChange",
      "filterTree"
    ])

  },
  watch: {
    filterTree: {
      deep: true,
      immediate: true,
      handler(val) {
        if (Array.isArray(val) && val.length) {
          this.treeData = cloneDeep(val);
          if (!this.currentNodeId) {
            const { currentNodeId } = this.$route.query;
            if (currentNodeId) {
              this.setCurrentNodeId(currentNodeId);
            } else {
              this.setCurrentNodeId(val[0].id);
            }
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
      "setCurrentNodeId",
      "setHasChange"
    ]),

    handleSelectNode(nodes, node) {
      console.log("handleSelectNode", nodes, node, this.currentNodeId)


      if (node.depth === 8) {
        this.$Message.info("支持最高层级不超过8级");
        return;
      }

      if (node.sponsordispatch) {
        if (node.sponsordispatch.issponsor) {
          return;
        }
      }
      if (node.id !== this.currentNodeId) {
        if (this.hasChange) {

          this.$Modal.confirm({
            title: "您想保存最新规划结果吗？",
            content: "<p>选择确定即使保存，选择取消即是取消改动</p>",
            loading: true,
            onOk: () => {
              eventBus.$emit("savePlan");
              this.$nextTick()
                .then(() => {
                  this.setHasChange(false);
                  this.$Modal.remove();
                  this.setCurrentNodeId(node.id);
                });
            },
            onCancel: () => {
              this.setHasChange(false);
              this.setCurrentNodeId(node.id);

            }
          });
        } else {
          this.setCurrentNodeId(node.id);
        }
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

      let src = ableReport;
      let ableOperate = false;
      if (data.sponsordispatch) {
        if (data.sponsordispatch.issponsor) {
          src = alreadyDispatch;
          ableOperate = true;
        }
      }

      return h("span", {
        class: {
          "ivu-tree-title-selected": data.id === this.currentNodeId,

        },
        props: {
        },
        style: {
          display: "inline-block",
          width: "100%",
          cursor: ableOperate ? "not-allowed" : "pointer"
        }
      }, [
        h("span", {

        }, [
          h("Icon", {
            props: {
              type: "ios-paper-outline"
            },
            style: {
              marginRight: "8px"
            }
          }),
          h("span", {
            style: {
              color: ableOperate ? "#777" : "#333"
            },
            domProps: {
              innerHTML: name
            }
          }),
          h("img", {
            attrs: {
              src,
            },
            style: {
              display: data.sponsordispatch ? "inline-block" : "none",
              // fontSize: "12px",
              // color: "#fff",
              // background: "#01326F",
              // padding: "0 4px",
              // borderRadius: "4px",
              marginLeft: "5px",
              width: "37px",
              height: "13px"
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
  flex-shrink: 0;
  .tree {
    padding: 20px;
    overflow: auto;
  }
}
</style>