<template>
  <div class>
    <section class="tree-content">
      <aside class="panel">
        <div class="base-info">
          <h3>基本信息</h3>
          <Form ref="form" :rules="rules" :model="currentNode" :hide-required-mark="true">
            <FormItem label="起始编码">
              <Input placeholder="起始编码" class="base-input" v-model.number="currentNode.nodecode" />
            </FormItem>
            <FormItem label="名称">
              <Input placeholder="名称" class="base-input" v-model="currentNode.name" />
            </FormItem>
            <FormItem label="subnet" prop="subnet">
              <Input placeholder="IPv6+后缀" class="base-input" v-model="currentNode.subnet" />
            </FormItem>
            <FormItem label="描述">
              <Input placeholder="描述" class="base-input" v-model="currentNode.usedfor" />
            </FormItem>
            <FormItem label="操作">
              <Button
                type="primary"
                size="small"
                :disabled="abledDelete"
                class="btn-del"
                @click="handleDeleteAllTree"
              >删除节点</Button>
            </FormItem>
          </Form>
        </div>

        <div class="child-node-edit">
          <div class="child-node-edit-head">
            <h3>
              子节点编辑
              <Button type="primary" size="small" class="btn-import-category">导入分类</Button>
            </h3>
          </div>

          <div class="count">
            <ul>
              <li>
                <Strong>{{currentNode.subtreebitnum? (Math.pow(2, currentNode.subtreebitnum) || 0):0}}</Strong>
                <span>总容量，双击修改</span>
              </li>
              <li>
                <Strong>{{Array.isArray(currentNode.children)? currentNode.children.length : 0}}</Strong>
                <span>已用容量</span>
              </li>
            </ul>
            <div style="padding: 10px 0">
              <span style="display: inline-block;margin-right: 10px">分配位数量:</span>
              <Input
                style="width:60px;"
                placeholder="容量"
                class="base-input"
                v-model.number="currentNode.subtreebitnum"
              />
            </div>
          </div>

          <div class="child-node-group">
            <ul class="childList">
              <li v-for="(item) in currentNode.children" :key="item.id">
                <div class="child-node">
                  {{item.name}}
                  <span class="close" @click="handleDeleteNode(item, currentNode)">x</span>
                </div>
              </li>
              <li v-if="showCreateChildNode">
                <div class="child-node" @click="handleAddChildNode">
                  +
                  <span></span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="btn-box">
          <Button type="primary" size="small" class="btn-complete" @click="handleSubmit">保存提交</Button>
        </div>
      </aside>

      <div class="graph">
        <div class="memo-assign">
          <h3>
            地址分配图
            <span>高亮区域表示所选节点的总容量</span>
          </h3>
          <Caliper :value="caliperValue" @onChange="handleChangeCaliper"></Caliper>
          <!-- <Allocation /> -->
        </div>
        <div class="tree">
          <tree
            :data="tree"
            node-text="name"
            layoutType="horizontal"
            :duration="20"
            @onClickNode="handleClickNode"
          >
            <!-- <template slot="pop" slot-scope="{props}">
              <div class="btn-group-vertical">
                <button @click="handleAddChildNode(props)">增加节点</button>
                <button @click="remove(props)">删除节点</button>
              </div>
            </template>-->
          </tree>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import tree from "./CoreTree";
import Caliper from "./modules/Caliper";
import Allocation from "./modules/Allocation";
import services from "../../services";
import { subnetValidateFunc } from "@/util/common";

let currentId = 0;

export default {
  components: {
    tree,
    Caliper,
    Allocation
  },
  data() {
    return {
      tree: {
        name: "root",
        depth: 0
      },
      currentNode: {},
      currentParent: {}
    };
  },
  computed: {
    rules() {
      return {
        subnet: [
          {
            required: true,
            message: "subnet 必填"
          },
          {
            validator: subnetValidateFunc
          }
        ]
      };
    },
    abledDelete() {
      return !(this.currentNode.id && this.currentNode.id.length > 5);
    },
    caliperValue() {
      let start = 0,
        end = 0;

      if (this.currentNode.subnet && this.currentNode.subnet.length > 4) {
        end = this.currentNode.subnet.slice(-2);

        end = Number(end) || 0;
      }
      const parent = this.currentParent;
      if (parent && parent.data && parent.data.subnet) {
        // TODO:  slice可能是一位
        start = parent.data.subnet.slice(-2);
      }
      console.log(start, end);
      return [start, end];
    },
    hasTree() {
      return !!this.tree.id;
    },
    showCreateChildNode() {
      const hasCurrentNode = !!this.currentNode.id;
      return this.hasTree && hasCurrentNode;
    }
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    getTreeData() {
      const params = {};
      services
        .getSubtree(params)
        .then(res => {
          if (res.data) {
            this.tree = this.transformTreeData(res.data);
          } else {
            this.tree = {
              name: "root",
              depth: 0,
              children: []
            };
          }
        })
        .catch(() => {
          this.$Message.error("数据获取失败");
        });
    },
    transformTreeData(data) {
      const str = JSON.stringify(data);
      return JSON.parse(str.replace(/nodes/g, "children"));
    },
    reverseTransformTreeData(data) {
      Array.isArray(data.nodes) &&
        data.nodes.forEach(node => {
          delete node.id;
          if (Array.isArray(node.nodes)) {
            this.reverseTransformTreeData(node.nodes);
          }
        });
    },

    handleChangeCaliper([min, max]) {
      console.log(min, max);
      console.log(this.currentParent);
      if (this.currentParent) {
        this.currentParent.data.subtreebitnum = max - min;
      }
    },
    handleDeleteNode(node, { children }) {
      // TODO: 这里要要深入学习一下js引用类型的原理
      this.currentNode.children = children.filter(
        child => node.id !== child.id
      );
    },
    handleAddChildNode() {
      console.log(33, this.currentNode);
      // 判断，当根节点没有subnet的时候，不能添加子节点
      if (!this.tree.id) {
        this.$Message.info("请先创建保存根节点后，再创建子节点");
        return;
      }
      if (this.currentNode.id) {
        console.log(this.currentNode);
        const nodecodeIndex = Array.isArray(this.currentNode.children)
          ? this.currentNode.children.length
          : 0;
        const newNode = {
          id: `${currentId++}`,
          children: [],
          name: `子网${currentId}`,
          nodecode: nodecodeIndex
        };

        if (Array.isArray(this.currentNode.children)) {
          this.currentNode.children.push(newNode);
        } else {
          this.currentNode.children = [newNode];
        }
      } else {
        this.$Message.info("请先选择节点");
      }
    },
    remove({ node }) {
      node.parent.data.children = node.parent.data.children.filter(child => {
        return child.name !== node.data.name;
      });
    },
    handleClickNode(element, data) {
      console.log(data);
      this.currentParent = data.parent;
      this.currentNode = data.data;
    },
    handleSubmit() {
      const params = JSON.parse(
        JSON.stringify(this.tree).replace(/children/g, "nodes")
      );
      this.reverseTransformTreeData(params);

      if (this.hasTree) {
        services.updateSubtree(params).then(res => {
          this.$Message.success("更新成功!");
          this.getTreeData();
          this.currentNode = {};
        });
      } else {
        console.log(this.currentNode);
        if (!this.currentNode.name) {
          this.$Message.info("请选中根节点!");
          return;
        }
        // 创建树的本质控制只创建一个根节点
        this.$refs.form.validate(valid => {
          if (valid) {
            services.createSubtree(params).then(res => {
              this.$Message.success("创建成功!");
              this.getTreeData();
              this.currentNode = {};
            });
          }
        });
      }
    },
    handleDeleteAllTree() {
      if (this.currentNode.id) {
        this.$Modal.confirm({
          title: "删除确认",
          onOk: () => {
            const params = {
              id: this.currentNode.id
            };
            services.deleteSubtree(params).then(res => {
              this.$Message.success("删除成功!");
              this.currentNode = {};
              this.getTreeData();
            });
          },
          okCancel: () => {}
        });
      } else {
        this.$Message.info("请先选择节点");
      }
    }
  }
};
</script>
<style lang="less">
.base-info {
  .ivu-form-item {
    margin-bottom: 12px;
  }
}
</style>
<style lang="less" scoped>
.tree {
  min-height: 800px;
  .btn-group-vertical {
    button {
      display: block;
    }
  }
}
.tree-content {
  overflow: hidden;
  background: #f5f5f5;
  .graph {
    background: #fff;
    padding: 40px;
    margin-right: 380px;

    .memo-assign {
      h3 {
        font-size: 24px;
        color: #333;
        margin-bottom: 30px;
        span {
          font-size: 14px;
          color: #808080;
          padding-left: 30px;
        }
      }
    }
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
    position: relative;
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
    .close {
      position: absolute;
      right: 0;
      top: 0;
      background: crimson;
      color: #fff;
      width: 20px;
      height: 16px;
      text-align: center;
      line-height: 1;
      border-radius: 0 6px 0 6px;
      cursor: pointer;
    }
  }
}

.btn-del {
  height: 32px;
  line-height: 32px;
}

.btn-box {
  overflow: hidden;
  button {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
}

.btn-complete {
}
</style>
<style lang="">
.check {
  border: 1px solid #f00;
}
</style>