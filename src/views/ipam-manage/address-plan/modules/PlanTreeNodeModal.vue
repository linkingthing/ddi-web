<template>
  <div
    class="PlanTreeNodeModal"
    v-if="visible"
  >
    <div class="PlanTreeNodeModal-header">
      规划编辑
    </div>
    <div class="PlanTreeNodeModal-content">

      <div class="prefix-range">
        <strong>{{currentNodePrefixLen}}-{{Number(currentNodePrefixLen)+currentNodeBitWidth}}</strong>
        <span>当前规划区段</span>
      </div>

      <SegmentAxis
        :enable-prefix-len="+prefixLen"
        :prefix-len="Number(currentNodePrefixLen)"
        :bit-width="currentNodeBitWidth"
      />
      <Form
        style="padding-top: 36px"
        :label-width="60"
        label-position="left"
        :label-colon="true"
      >
        <FormItem label="起始值">
          <Input
            v-model="startValue"
            placeholder="请输入起始值"
            style="width: 220px;margin-right: 20px;float:left"
          />
          <Button
            @click="handleAutoCreate"
            type="primary"
            style="width: 110px"
          >自动生成</Button>
        </FormItem>
      </Form>

      <Form
        label-position="left"
        :label-colon="true"
      >
        <FormItem label="生成值（双击可修改）">
          <div class="branch-list">
            <ul>
              <li
                v-for="item in createValueList"
                :key="item.id"
                @dblclick="handledblclick(item)"
              >
                <Input
                  v-model="item.value"
                  v-if="item.isEdit"
                />
                <span v-else>{{item.value}}</span>

              </li>
            </ul>
          </div>
        </FormItem>
      </Form>

      <Button
        type="primary"
        long
        @click="handleSaveValue"
      >确定</Button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapGetters, mapMutations } from "vuex";
import { findNodeById } from "./helper";

import SegmentAxis from "@/components/SegmentAxis";
export default {
  components: {
    SegmentAxis
  },
  props: {},
  data() {
    return {
      visible: false,
      prefixLen: "",
      currentNodePrefixLen: 0,
      currentNodeBitWidth: 0,
      startValue: "",
      currentParentNode: {},
      createValueList: []
    };
  },
  computed: {
    ...mapState({
      "currentLayout": state => state.layout.currentLayout
    }),
    ...mapGetters([
      "currentPrefix",
      "currentNode"
    ])
  },
  watch: {
    currentPrefix: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          const [, prefixLen] = val.split("/");
          this.prefixLen = prefixLen;
        }
      }
    },
    currentNode: {
      deep: true,
      immediate: true,
      handler(val) {
        this.createValueList = [];
        if (val.pid) {
          if (val.pid === "0") {
            this.visible = false;
          } else {
            this.visible = true;
          }
          const parentNode = findNodeById(this.currentLayout, val.pid);
          if (parentNode) {
            console.log(1, parentNode)
            if (parentNode.prefix) {
              const [, prefixLen] = parentNode.prefix.split("/");
              this.currentNodePrefixLen = prefixLen;
            }

            this.currentNodeBitWidth = val.bitWidth;

            this.currentParentNode = _.cloneDeep(parentNode);

            parentNode.nodes.forEach(item => {
              if (item.value) {
                this.createValueList.push({
                  isEdit: false,
                  value: item.value
                });
              }
            });

          } else {
            this.currentNodePrefixLen = 0;
          }

        } else {
          this.currentNodePrefixLen = 0;
          this.currentNodeBitWidth = 0;
          this.currentParentNode = {};
        }
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "setCurrentNodeId",
      "setCurrentNodeChildrenList"
    ]),
    handleAutoCreate() {

      let startValue = this.startValue || 1;
      this.createValueList = [];

      if (Array.isArray(this.currentParentNode.nodes)) {
        this.currentParentNode.nodes.forEach(item => {

          this.createValueList.push({
            id: item.id,
            isEdit: false,
            value: startValue
          });

          item.value = startValue++;

        });

      }
    },

    handledblclick({ value }) {
      this.createValueList.forEach(item => {
        if (item.value === value) {
          item.isEdit = true;
        }
      });
    },

    handleSaveValue() {
      this.setCurrentNodeId(this.currentParentNode.id);
      const currentNodeSiblings = this.currentParentNode.nodes;
      currentNodeSiblings.forEach(node => {
        node.value = +this.createValueList.find(item => item.id === node.id).value;
      });
      this.setCurrentNodeChildrenList(currentNodeSiblings);
    }
  }
};
</script>

<style lang="less" scoped>
.PlanTreeNodeModal {
  position: absolute;
  right: 0;
  z-index: 100;
  width: 460px;
  border-radius: 4px;
  box-shadow: 0px 0px 16px 0px rgba(67, 67, 67, 0.1);
  background: #fff;

  .PlanTreeNodeModal-header {
    height: 54px;
    line-height: 24px;
    padding: 15px;
    font-size: 18px;
    color: #333;
    font-weight: bold;
    background: #e6e6e6;
  }
  .PlanTreeNodeModal-content {
    padding: 30px 24px;
  }

  .prefix-range {
    strong {
      display: block;
      font-size: 24px;
      color: #333;
    }
    span {
      font-size: 14px;
      color: #999;
    }
  }

  .branch-list {
    margin-top: 34px;

    ul {
      overflow: hidden;
    }

    li {
      float: left;
      display: block;
      width: 70px;
      height: 36px;
      line-height: 36px;
      border: 1px solid #ccc;
      margin-right: 16px;
      margin-bottom: 16px;
      text-align: center;
      border-radius: 4px;
    }
  }
}
</style>