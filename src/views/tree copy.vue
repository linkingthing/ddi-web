<template>
  <div class="tree">
    <tree
      v-model="tree"
      :data="tree"
      node-text="name"
      layoutType="horizontal"
      :duration="20"
      @clickedNode="handleClickNode"
      @clickedText="handleClickText"
    >
      <template #popUp="{data,node}">
        <div class="btn-group-vertical">
          <button @click="addFor(data)">增加子节点</button>
          <button @click="remove(data, node)">删除</button>
        </div>
      </template>
    </tree>
    <!-- <Vue2OrgTree
      :data="tree"
      @on-node-click="handleClick"
      :props="{
        label: 'name', children: 'children'
    }"
    /> -->
    <div class="panel">
      <Form>
        <FormItem label="name">
          <Input v-model="currentNode.name" />
        </FormItem>
        <FormItem label="ip">
          <Input v-model="currentNode.ip" />
        </FormItem>
      </Form>
    </div>
  </div>
</template>


<script>
import { tree } from "vued3tree";
import Vue2OrgTree from "vue2-org-tree";

let currentId = 0;

const removeElement = (arr, element) => {
  const index = arr.indexOf(element);
  if (index === -1) {
    return;
  }
  arr.splice(index, 1);
};
export default {
  components: {
    tree,
    Vue2OrgTree
  },
  data() {
    return {
      tree: {
        name: "father",
        children: [
          {
            name: "son1",
            ss: "2222",
            ip: "10.0.0.137",
            children: [{ name: "grandson" }, { name: "grandson2" }]
          },
          {
            name: "son2",
            children: [{ name: "grandson3" }, { name: "grandson4" }]
          }
        ]
      },
      currentNode: {}
    };
  },
  methods: {
    handleClick(element, data, target) {
      console.log(element, data, target);
      this.currentNode = data;

      element.target.classList.add("check");
    },
    addFor(data) {
      console.log(data);
      const newData = {
        identifier: currentId,
        children: [],
        text: 122
      };
      data.children.push(newData);
    },
    remove(data, node) {
      console.log(data, node);
      try {
        const parent = node.parent.data;
        removeElement(parent.children, data);
      } catch (e) {
        console.log("11");
      }
    },
    handleClickNode(element, data, target) {
      console.log(element, data, target);
    },
    handleClickText(element, data, target) {
      console.log(element, data, target);
      this.currentNode = element.data;
    }
  }
};
</script>

<style lang="less" scoped>
.tree {
  width: 500px;
  height: 400px;
}
</style>
<style lang="">
.check {
  border: 1px solid #f00;
}
</style>