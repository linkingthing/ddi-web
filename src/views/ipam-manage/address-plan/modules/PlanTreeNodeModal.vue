<template>
  <div
    class="PlanTreeNodeModal"
    v-if="visible"
  >
    <div class="PlanTreeNodeModal-header">
      规划编辑
      <span
        class="PlanTreeNodeModal-header-close"
        @click="visible = false"
      >x</span>
    </div>
    <div class="PlanTreeNodeModal-content">

      <div class="prefix-range">
        <strong>{{Number(currentNodePrefixLen)+1}}-{{Number(currentNodePrefixLen)+currentNodeBitWidth}}</strong>
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
import eventBus from "@/util/bus";
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
    ...mapGetters([
      "currentPrefix",
      "currentLayout",
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
          }
          if (this.currentLayout.autofill) {
            this.visible = false;
          }
          const parentNode = findNodeById(this.currentLayout, val.pid);
          if (parentNode) {


            this.currentNodeBitWidth = val.bitWidth;

            this.currentParentNode = _.cloneDeep(parentNode);

            parentNode.nodes.forEach(item => {

              if (item.value && item.value !== -1) {
                this.createValueList.push({
                  id: item.id,
                  isEdit: false,
                  value: item.value
                });
              } else {
                this.createValueList.push({
                  id: item.id,
                  isEdit: true,
                  value: ""
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
  mounted() {
    eventBus.$on("onSelectNode", this.onSelectNode);
  },
  methods: {
    ...mapMutations([
      "setCurrentNodeId",
      "setCurrentNodeSiblingsList"
    ]),
    onSelectNode(data, node) {
      // 设置面板 prefix相关
      if (node.parent) {
        const parentNode = node.parent.data;
        const [, len] = parentNode.prefix.split("/");
        if (len) {
          this.visible = true;
          this.currentNodePrefixLen = len;
          this.currentNodeBitWidth = data.bitWidth;
        } else {
          this.visible = false;
        }
      } else {
        this.visible = false;
      }
    },

    handleAutoCreate() {
      let startValue = this.startValue || 1;

      /**
       * 起始值校验
       * 大于0
       * 默认为1
       * 小于 最大节点减去当前节点
       * 
       * */

      if (startValue < 1) {
        this.$Message.error("起始值应大于0");
        return;
      }

      const parentNode = findNodeById(this.currentLayout, this.currentNode.pid);
      if (parentNode) {
        if (parentNode.nodes) {
          const bitWidth = this.currentNode.bitWidth;
          const siblingsCount = parentNode.nodes.length;

          const minStart = 2 ** bitWidth - siblingsCount;
          if (minStart < startValue) {
            this.$Message.error(`起始值应小于或等于${minStart}`);
            return;
          }

        }
      }


      this.createValueList = [];

      if (Array.isArray(this.currentParentNode.nodes)) {
        this.currentParentNode.nodes.forEach(item => {

          this.createValueList.push({
            id: item.id,
            isEdit: false,
            value: +startValue
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

      const numberList = this.createValueList.map(item => +item.value);

      // 每一项的数字是按升序
      const isAsc = numberList.join(",") === numberList.sort((a, b) => a - b).join(",");
      if (!isAsc) {
        this.$Message.error("生成值需要由小到大规划");
        return;
      }

      // 每个值都应该在位宽对应范围内
      const { bitWidth } = this.currentNode;
      const maxValue = 2 ** bitWidth - 1;
      const isValidEveryValue = numberList.every(item => maxValue >= item && item > 0);
      if (!isValidEveryValue) {
        this.$Message.error(`当前节点每个生成值需要在(0, ${maxValue}]范围内`);
        return;
      }

      // value值不能重复
      const hasRepeat = numberList.length !== [...new Set(numberList)].length;
      if (hasRepeat) {
        this.$Message.error(`生成值不能重复`);
        return;
      }

      const currentNodeSiblings = this.currentParentNode.nodes;
      currentNodeSiblings.forEach(node => {
        const item = this.createValueList.find(item => item.id === node.id);
        if (item) {
          node.value = +this.createValueList.find(item => item.id === node.id).value;
        }
      });
      this.setCurrentNodeSiblingsList(currentNodeSiblings);
    }
  }
};
</script>

<style lang="less">
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
    .PlanTreeNodeModal-header-close {
      float: right;
      cursor: pointer;
    }
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
      margin-right: 16px;
      margin-bottom: 16px;
      text-align: center;
      span {
        display: inline-block;
        width: 70px;
        height: 36px;
        line-height: 36px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .ivu-input {
        height: 36px;
        text-align: center;
      }
    }
  }
}
</style>