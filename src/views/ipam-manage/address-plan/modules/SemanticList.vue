<template>
  <div class="SemanticList">
    <h3 class="SemanticList-title">{{title}}</h3>
    <div class="plan-count">
      <span>为提高规划的可扩展性，建议您填写期望的分支数量，预留将来可规划的空间：</span>
      <Input
        placeholder="期望分支数量（选填）"
        style="width:260px"
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
import SemanticListItem from "./SemanticListItem";
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
      semanticList: [{
        id: 1,
        title: "机构",
        isEdit: false
      },
      {
        id: 2,
        title: "业务",
        isEdit: false
      },
      {
        id: 3,
        title: "数据中心",
        isEdit: false
      }]
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handleAdd() {
      this.semanticList.push({
        id: new Date().getTime(),
        title: "",
        isEdit: true
      });
    },
    handleSave(id, title) {
      this.semanticList.forEach(item => {
        if (item.id === id) {
          item.title = title;
          item.isEdit = false;
        }
      });
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