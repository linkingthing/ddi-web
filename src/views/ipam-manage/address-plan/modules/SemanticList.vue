<template>
  <div class="SemanticList">
    <h3 class="SemanticList-title">{{currentNode.name}}</h3>
    <div class="plan-count">
      <span>为提高规划的可扩展性，建议您填写期望的分支数量，预留将来可规划的空间：</span>
      <Select
        :disabled="!ableEditBitWidth"
        v-model.number="bitWidth"
        style="width:160px"
      >
        <Option
          v-for="item in countList"
          :value="item.bitWidth"
          :key="item.bitWidth"
        >{{item.name}}</Option>
      </Select>
    </div>

    <div class="branch-list">
      <SemanticListItem
        v-for="item in semanticList"
        v-bind="item"
        :key="item.id"
        @onFinish="handleSave"
        @onEdit="handleEdit"
        @onDelete="handleDelete"
      />
    </div>

    <Button
      :disabled="!ableAdd"
      icon="ios-add"
      type="default"
      @click="handleAdd"
    >添加</Button>

  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import { mapGetters, mapMutations, mapState } from "vuex";
import SemanticListItem from "./SemanticListItem";
import { defaultBitWidth, findNodeById, executeBitWidthSum, getTreeLeaf } from "./helper";

export default {
  components: {
    SemanticListItem
  },
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    // autofill后的叶子节点都改属于白名单
    this.ableEditBitWidthWihteList = [];
    return {
      semanticList: [],
      bitWidth: "",
      countList: [
        {
          name: "15",
          bitWidth: 4
        },
        {
          name: "255",
          bitWidth: 8
        },
        {
          name: "4095",
          bitWidth: 12
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      "planList",
      "currentNode",
      "currentNodeChildrenList",
      "currentLayout"
    ]),
    ableEditBitWidth() {
      const { autofill } = this.currentLayout;
      const currentNode = this.currentNode;

      const hasFinish = typeof autofill === "boolean";

      // 语义规划完成后不可改 autofill 为 bool，已选择的不能改，未选的可改
      if (hasFinish) {
        if (!this.ableEditBitWidthWihteList.includes(currentNode.id)) {
          return false; // false 不可编辑
        }
      }

      // 语义规划阶段有孙子节点时不能改位宽
      if (currentNode.nodes && currentNode.nodes.length) {
        const son = currentNode.nodes[0];
        if (son && son.nodes && son.nodes.length) {
          return false;
        }
      }

      return true;
    },
    ableAdd() {
      const current = this.countList.find(item => {
        return +item.bitWidth === +this.bitWidth;
      });

      if (!this.bitWidth) {
        return false;
      }

      if (current) {
        return +current.name > this.semanticList.length;
      } else {
        return true;
      }
    }
  },
  watch: {
    currentNodeChildrenList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (Array.isArray(val)) {
          this.semanticList = val.map(item => {
            return {
              id: item.id,
              name: item.name,
              isEdit: false,
              expand: true,
              pid: item.pid,
              bitWidth: item.bitWidth,
              value: item.value,
              nodes: item.nodes
            };
          });
        }

      }
    },
    bitWidth(val, old) {
      // 位宽个数不能改低于已存在子节点个数
      const childrenNodeCount = this.semanticList.length;
      const bitWidthCount = 2 ** val - 1;

      if (childrenNodeCount > bitWidthCount) {
        this.$Message.error("当且已有节点数量超过预设位宽可容纳数量");
        this.bitWidth = old;
        return false;
      }

      if (val) {
        this.setCurrentNodeBitWidth(val);
      }
    },
    "currentNode": {
      deep: true,
      immediate: true,
      handler(val) {

        // 设置可选位宽
        const maxBitLen = 64;
        const bitWidthSum = executeBitWidthSum(this.currentLayout, val);
        const surplus = maxBitLen - bitWidthSum;
        this.countList = [];
        if (surplus < 4) {
          this.countList = [{
            name: `${2 ** surplus - 1}`,
            bitWidth: surplus
          }];
        }

        if (surplus >= 4) {
          this.countList.push({
            name: "15",
            bitWidth: 4
          });
        }

        if (surplus >= 8) {
          this.countList.push({
            name: "255",
            bitWidth: 8
          });
        }

        if (surplus >= 12) {
          this.countList.push({
            name: "4095",
            bitWidth: 12
          });
        }

        if (Array.isArray(val.nodes)) {
          if (val.nodes.length) {
            const rootNodeHasBitWidth = !!val.nodes[0].bitWidth;
            if (rootNodeHasBitWidth) {
              this.bitWidth = val.nodes[0].bitWidth;
            } else {
              this.bitWidth = "";
            }
          } else {
            this.bitWidth = "";
          }
        } else {
          this.bitWidth = "";
        }
      }
    },
    currentLayout: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.nodes) {
          const leafs = getTreeLeaf(val.nodes);
          leafs.forEach(item => {
            if (!this.ableEditBitWidthWihteList.includes(item.id)) {
              this.ableEditBitWidthWihteList.push(item.id);
            }
          });
        }
      }
    }
  },
  created() { },
  mounted() {

  },
  methods: {
    ...mapMutations([
      "setPlanList",
      "setCurrentNode",
      "setCurrentNodeChildrenList",
      "setCurrentNodeBitWidth"
    ]),
    handleAdd() {
      /**
       * 判断递归的位宽叠加
       * - 等于于64则不能继续加
       * - 接近64，则位宽设为 （0，4）
      */

      const bitWidthSum = executeBitWidthSum(this.currentLayout, this.currentNode);

      if (bitWidthSum === 64) {
        this.$Message.error("当前节点已规划到64位，不能继续增加子节点");
        return;
      }

      // 当前节点没有设置位宽，也不能增加子节点,根节点除外

      if (!this.currentNode.bitWidth && this.currentNode.pid !== "0") {
        this.$Message.error("请先设置节点位宽，才能继续增加子节点");
        return;
      }


      this.semanticList.push({
        id: uuidv4(),
        pid: this.currentNode.id,
        name: "",
        isEdit: true,
        modified: 1,
        nodes: [],
        bitWidth: defaultBitWidth,
        value: -1
      });
    },
    handleSave(id, name) {
      if (name.length > 15) {
        this.$Message.error("请输入少于等于15字符");
        return;
      }
      const semanticList = this.semanticList.map(item => {
        if (item.id === id) {
          item.name = name;
          item.isEdit = false;
          item.bitWidth = this.bitWidth;
        }
        return item;
      }).filter(item => {
        return !!item.name;
      });
      this.setCurrentNodeChildrenList(semanticList);
    },
    handleEdit(id) {
      this.semanticList.forEach(item => {
        if (item.id === id) {
          item.isEdit = true;
        }
      });
    },
    handleDelete(id) {
      this.semanticList = this.semanticList.filter(item => {
        return item.id !== id;
      });
      this.setCurrentNodeChildrenList(this.semanticList);
    }
  }
};
</script>

<style lang="less" scoped>
.SemanticList {
  padding-left: 45px;
}
.SemanticList-title {
  color: #333;
  font-size: 18px;
  margin-bottom: 16px;
}
.plan-count {
  font-size: 12px;
  color: #999;
}

.branch-list {
  width: 450px;
  padding: 10px 0;
  margin-bottom: 12px;
}
</style>