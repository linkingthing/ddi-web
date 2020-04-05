<template>
  <div class>
    <section class="tree-content">
      <aside class="panel">
        <div class="panel-title">
          <h2>编辑节点</h2>
          <nav class="menuGroup">
            <a class="active">一级按钮</a>
            <a class>一级按钮</a>
            <a class>一级按钮</a>
          </nav>
        </div>
        <div class="base-info">
          <h3>基本信息</h3>
          <Input placeholder="编码" class="base-input" />
          <Input placeholder="名称" class="base-input" />
          <Input placeholder="IPv6" class="base-input" />
        </div>

        <div class="child-node-edit">
          <div class="child-node-edit-head">
            <h3>
              子节点编进
              <Button type="primary" size="small" class="btn-import-category">导入分类</Button>
            </h3>
          </div>

          <div class="count">
            <ul>
              <li>
                <Strong>32</Strong>
                <span>总容量，双击修改</span>
              </li>
              <li>
                <Strong>14</Strong>
                <span>已用容量</span>
              </li>
            </ul>
          </div>

          <div class="child-node-group">
            <Input placeholder="请输入子节点分类" class="category" />
            <ul class="childList">
              <li>
                <div class="child-node">
                  子节点名称
                  <span></span>
                </div>
              </li>
              <li>
                <div class="child-node">
                  子节点名称
                  <span></span>
                </div>
              </li>
              <li>
                <div class="child-node">
                  子节点名称
                  <span></span>
                </div>
              </li>
              <li>
                <div class="child-node">
                  子节点名称
                  <span></span>
                </div>
              </li>
              <li>
                <div class="child-node" @click="handleAddChildNode">
                  +
                  <span></span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Button type="primary" size="small" class="btn-complete">编辑完成，立即生成</Button>
      </aside>

      <div class="graph">
        <div>
          <Caliper></Caliper>
        </div>
        <div class="tree">
          <tree
            :data="tree"
            node-text="name"
            layoutType="horizontal"
            :duration="20"
            @onClickNode="handleClickNode"
            @clickedText="handleClickText"
          >
            <template slot="pop" slot-scope="{props}">
              <div class="btn-group-vertical">
                <button @click="handleAddChildNode(props)">增加子节点</button>
                <button @click="remove(props)">删除</button>
              </div>
            </template>
          </tree>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import tree from "./CoreTree";
import Caliper from "./modules/Caliper";

let currentId = 0;

export default {
  components: {
    tree,
    Caliper
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
    handleAddChildNode({ node }) {
      console.log(node);
      const newNode = {
        identifier: currentId++,
        children: [],
        name: "122"
      };
      if (Array.isArray(this.currentNode.children)) {
        this.currentNode.children.push(newNode);
      }
    },
    remove({ node }) {
      node.parent.data.children = node.parent.data.children.filter(child => {
        return child.name !== node.data.name;
      });
    },
    handleClickNode(element, data, target) {
      this.currentNode = data.data;
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
  min-height: 800px;
  background: #fff;
}
.tree-content {
  overflow: hidden;
  background: #f5f5f5;
  .graph {
    margin-right: 380px;
  }
  .panel {
    float: right;
    width: 380px;
    min-height: 500px;
    padding: 40px 30px;

    .panel-title {
      color: #333;
      h2 {
        font-size: 24px;
        margin-bottom: 28px;
      }
    }
  }
}

.menuGroup {
  a {
    display: inline-block;
    width: 140px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    background: #e5e5e5;
    padding: 0 12px;
    border-radius: 4px;
    color: #333;
    margin-bottom: 20px;
    &:nth-child(even) {
      margin-left: 20px;
    }
    &.active {
      background: #fff;
      border: 1px solid #2d8cf0;
      color: #2d8cf0;
    }
  }
}

.base-info {
  margin-bottom: 20px;
  h3 {
    font-size: 20px;
    margin-bottom: 24px;
  }
  .base-input {
    margin-bottom: 20px;
  }
}

.child-node-edit-head {
  margin-bottom: 20px;
  h3 {
    font-size: 20px;
  }
  .btn-import-category {
    float: right;
  }
}

.count {
  margin-bottom: 20px;
  ul {
    overflow: hidden;
    li {
      float: left;
      width: 50%;
    }
  }
  strong {
    font-size: 20px;
  }
  span {
    display: block;
    font-size: 14px;
    color: #808080;
  }
}

.child-node-group {
  .category {
    margin-bottom: 20px;
  }
}
.childList {
  font-size: 0;
  li {
    display: inline-block;
    margin-bottom: 20px;
    &:nth-child(even) {
      margin-left: 20px;
    }
  }

  .child-node {
    display: inline-block;
    width: 140px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    background: #e5e5e5;
    padding: 0 12px;
    border-radius: 4px;
    color: #333;
  }
}

.btn-complete {
  display: block;
  width: 100%;
  height: 40px;
  line-height: 40px;
}
</style>
<style lang="">
.check {
  border: 1px solid #f00;
}
</style>