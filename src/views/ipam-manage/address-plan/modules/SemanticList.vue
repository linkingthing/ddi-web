<template>
  <div class="SemanticList">
    <h3 class="SemanticList-title">{{currentNode.name}}</h3>
    <div class="plan-count">
      <span>为提高规划的可扩展性，建议您填写期望的分支数量，预留将来可规划的空间：</span>
      <Select
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
import { defaultBitWidth, findNodeById } from "./helper";

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
      bitWidth: defaultBitWidth,
      countList: [{
        name: "16",
        bitWidth: 4
      },
      {
        name: "256",
        bitWidth: 8
      },
      {
        name: "4096",
        bitWidth: 12
      },
      {
        name: "4294967296",
        bitWidth: 32
      }
      ]
    };
  },
  computed: {
    ...mapGetters([
      "planList",
      "currentNode",
      "currentNodeChildrenList"
    ])
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
    bitWidth(val) {
      if (val) {
        this.setCurrentNodeBitWidth(val);
      }
    },
    "currentNode": {
      deep: true,
      immediate: true,
      handler(val) {
        if (Array.isArray(val.nodes)) {
          val.nodes.forEach(item => {
            this.bitWidth = item.bitWidth;
          });
        } else {
          this.bitWidth = "";
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
      this.semanticList.push({
        id: uuidv4(),
        pid: this.currentNode.id,
        name: "",
        isEdit: true,
        modified: 1,
        nodes: [],
        bitWidth: defaultBitWidth
      });
    },
    handleSave(id, name) {
      const semanticList = this.semanticList.map(item => {
        if (item.id === id) {
          item.name = name;
          item.isEdit = false;
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