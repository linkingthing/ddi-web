<template>
  <div class="SemanticList">
    <h3 class="SemanticList-title">{{title}}</h3>
    <div class="plan-count">
      <span>为提高规划的可扩展性，建议您填写期望的分支数量，预留将来可规划的空间：</span>
      <Input
        placeholder="期望分支数量（选填）"
        style="width:260px"
        v-model.number="bitWidth"
      />
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
      icon="ios-add"
      type="default"
      @click="handleAdd"
    >添加</Button>

  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import { mapState, mapGetters, mapMutations } from "vuex";
import SemanticListItem from "./SemanticListItem";
import { defaultBitWidth } from "./helper";
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
    return {
      semanticList: [],
      bitWidth: defaultBitWidth
    };
  },
  computed: {
    ...mapGetters([
      "currentNodeChildrenList",
      "currentNode"
    ])

  },
  watch: {
    currentNodeChildrenList: {
      deep: true,
      immediate: true,
      handler(val) {
        this.semanticList = val.map(item => {
          return {
            id: item.id,
            name: item.name,
            isEdit: false,
            expand: true
          };
        });
      }
    },
    bitWidth(val) {
      this.setCurrentNodeBitWidth(val);
    },
    "currentNode.bitWidth": {
      deep: true,
      immediate: true,
      handler(val) {
        this.bitWidth = val || defaultBitWidth;
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "setCurrentNode",
      "setCurrentNodeChildrenList",
      "setCurrentNodeBitWidth"
    ]),
    handleAdd() {
      this.semanticList.push({
        id: uuidv4(),
        pid: this.currentNode.id,
        name: "",
        isEdit: true
      });
    },
    handleSave(id, name) {
      this.semanticList.forEach(item => {
        if (item.id === id) {
          item.name = name;
          item.isEdit = false;
        }
      });
      this.setCurrentNodeChildrenList(this.semanticList);
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