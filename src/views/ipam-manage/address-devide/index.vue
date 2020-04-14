<template>
  <div class>
    <section class="tree-content">
      <aside class="panel">
        <div class="base-info">
          <h3>
            基本信息
            <Button
              type="error"
              size="small"
              :disabled="abledDelete"
              class="btn-del"
              @click="handleDeleteNodeImmediately"
            >删除节点</Button>
            <Button
              type="warning"
              size="small"
              :disabled="abledDelete"
              class="btn-del"
              @click="handleClickSplitSubnet"
            >子网拆分</Button>
            <Button
              type="success"
              size="small"
              :disabled="abledDelete"
              class="btn-del"
              @click="handleClickMergeSubnet"
            >子网合并</Button>
          </h3>
          <Form ref="form" :rules="rules" :model="currentNode" :hide-required-mark="true">
            <Row :gutter="20">
              <Col :span="12">
                <FormItem label="起始编码(二进制)" prop="beginnodecode">
                  <Input
                    disabled
                    placeholder="起始编码"
                    class="base-input"
                    v-model="beginNodeCodeBinary"
                  />
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem label="结束编码(二进制)" prop="endnodecode">
                  <Select
                    placeholder="结束编码"
                    class="base-input"
                    v-model.number="currentNode.endnodecode"
                  >
                    <Option
                      v-for="(item, index) in endNodeCodeOptions"
                      :value="item.value"
                      :key="index"
                    >{{item.binary}}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="名称">
              <Input placeholder="名称" class="base-input" v-model="currentNode.name" />
            </FormItem>
            <FormItem label="起始子网" :prop="beginsubnetprop">
              <Input placeholder="起始子网" class="base-input" v-model="currentNode.beginsubnet" />
            </FormItem>
            <FormItem label="结束子网" :prop="endsubnetprop">
              <Input placeholder="结束子网" class="base-input" v-model="currentNode.endsubnet" />
            </FormItem>
            <FormItem label="描述">
              <Input placeholder="描述" class="base-input" v-model="currentNode.usedfor" />
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
                <span>总容量</span>
              </li>
              <li>
                <Strong>{{Array.isArray(currentNode.children)? currentNode.children.length : 0}}</Strong>
                <span>已用容量</span>
              </li>
            </ul>
            <div style="padding: 10px 0">
              <span style="display: inline-block;margin-right: 10px">分配位数量:</span>
              <Input
                :disabled="autoAssign"
                style="width:60px;"
                placeholder="容量"
                class="base-input"
                v-model.number="currentNode.subtreebitnum"
              />
              <Checkbox v-model="autoAssign">自动分配</Checkbox>
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
                  <span />
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
          <Caliper :value="caliperValue" @onChange="handleChangeCaliper" :bit-fill="bitFill" />
          <!-- <Allocation /> -->
        </div>
        <div class="tree">
          <tree
            :data="tree"
            node-text="name"
            layout-type="horizontal"
            :duration="20"
            @onClickNode="handleClickNode"
            @onMultiple="handleMultipleNode"
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
import services from "@/services";
import { subnetValidateFunc } from "@/util/common";
import { excuteNextIPv6 } from "./tool";

let currentId = 0;

export default {
  components: {
    tree,
    Caliper,
    Allocation
  },
  data() {
    return {
      autoAssign: false,
      tree: {
        name: "root",
        depth: 0
      },
      currentNode: {},
      currentParent: {},
      bitFill: [0, 0] // 10进制，用于填充位
    };
  },
  computed: {
    rules() {
      return {
        endnodecode: [
          {
            required: true,
            message: "请填写结束编码"
          }
        ],
        beginsubnet: [
          {
            required: true,
            message: "请填写subnet"
          },
          {
            validator: subnetValidateFunc
          }
        ],
        endsubnet: [
          {
            required: true,
            message: "请填写subnet"
          },
          {
            validator: subnetValidateFunc
          }
        ]
      };
    },
    beginsubnetprop() {
      if (this.isRootNode) {
        return "beginsubnet";
      } else {
        return "beginsubnet2";
      }
    },
    endsubnetprop() {
      if (this.isRootNode) {
        return "endsubnet";
      } else {
        return "endsubnet2";
      }
    },
    abledDelete() {
      return !(this.currentNode.id && this.currentNode.id.length > 5);
    },
    caliperValue() {
      let start = 0,
        end = 0;

      if (this.currentNode.type === "addNode") {
        return [0, 0];
      }

      if (
        this.currentNode.beginsubnet &&
        this.currentNode.beginsubnet.length > 4
      ) {
        const [, prefixLen] = this.currentNode.beginsubnet.split("/");

        end = Number(prefixLen) || 0;
      }
      const parent = this.currentParent;
      // if (parent && parent.data && parent.data.beginsubnet) {
      //   const [, prefixLen] = parent.data.beginsubnet.split("/");
      //   start = prefixLen;
      // } 以前只有一个subnet，只有beginsubnet
      if (
        parent &&
        parent.data &&
        parent.data.subtreebitnum &&
        this.currentNode.beginsubnet
      ) {
        const [, prefixLen] = this.currentNode.beginsubnet.split("/");
        start = prefixLen - parent.data.subtreebitnum;
      }

      return [start, end];
    },
    hasTree() {
      return !!this.tree.id;
    },
    isRootNode() {
      return this.currentNode.depth === 0;
    },
    showCreateChildNode() {
      const hasCurrentNode = !!this.currentNode.id;
      return this.hasTree && hasCurrentNode;
    },
    beginNodeCodeBinary() {
      let nodecode = this.currentNode.beginnodecode;
      if (!nodecode) {
        nodecode = "0";
      }
      const bitWidth =
        this.currentParent &&
        this.currentParent.data &&
        this.currentParent.data.subtreebitnum;
      const binary = (Array(bitWidth).join("0") + nodecode.toString(2)).slice(
        -bitWidth
      );
      return binary;
    },
    endNodeCodeOptions() {
      // 补位法计算
      let begin = this.currentNode.beginnodecode || 0;
      const bitWidth =
        this.currentParent &&
        this.currentParent.data &&
        this.currentParent.data.subtreebitnum;
      const beginArr = (Array(bitWidth).join("0") + begin.toString(2))
        .slice(-bitWidth)
        .split("");
      const options = [beginArr.join("")];
      for (let i = beginArr.length; i > 0; i--) {
        if (beginArr[i - 1] === "1") {
          break;
        } else {
          beginArr[i - 1] = "1";
          options.push(beginArr.join(""));
        }
      }

      return options.map(item => {
        return {
          value: parseInt(item, 2),
          binary: (Array(bitWidth).join("0") + item.toString(2)).slice(
            -bitWidth
          )
        };
      });
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
            this.treeDataAddOther(this.tree);
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
    treeDataAddOther(tree) {
      const { subtreebitnum, children } = tree;
      if (Array.isArray(children)) {
        const { beginsubnet } = children[children.length - 1];
        const [ip, prefixLen] = beginsubnet.split("/");

        children.forEach(child => {
          child.type = "originalNode";
          this.treeDataAddOther(child);
        });
        children.push({
          id: "1000",
          name: "剩余资源",
          type: "surplusNode",
          siblingsTotalBitNumber: subtreebitnum,
          beginsubnet: excuteNextIPv6(ip, prefixLen, subtreebitnum, 1),
          endsubnet: excuteNextIPv6(
            ip,
            prefixLen,
            subtreebitnum,
            Math.pow(2, subtreebitnum) - 1
          )
        });
      }
    },
    clearExtraNode(tree) {
      if (Array.isArray(tree.nodes)) {
        tree.nodes = tree.nodes.filter(item => item.type !== "surplusNode");
        tree.nodes.forEach(child => this.clearExtraNode(child));
      }
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

    getBinaryByIPv6(params) {
      const [, len] = params.prefix.split("/");
      services.checkIPv6Prefix(params).then(res => {
        this.bitFill = [
          parseInt(res.data.binary.substring(0, len), 2),
          parseInt(res.data.binary.substring(0, len), 2)
        ];
      });
    },
    handleChangeCaliper([min, max]) {
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
          nodecode: nodecodeIndex,
          type: "addNode"
        };

        if (Array.isArray(this.currentNode.children)) {
          // 在倒数第二个上插入，倒数第一个时剩余量
          this.currentNode.children.splice(
            this.currentNode.children.length - 1,
            0,
            newNode
          );
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
    handleBeforeChangeNode(cb) {
      // 节点点击之前校验 validateCurrentNode
      this.$refs.form.validate(valid => {
        if (valid) {
          cb();
        }
      });
    },
    handleClickNode(data) {
      console.log(data);
      if (data.depth === 0) {
        if (data.data.beginsubnet) {
          this.getBinaryByIPv6({
            prefix: data.data.beginsubnet
          });
        }
      } else {
        if (data.data.type === "originalNode") {
          this.bitFill = [data.data.beginnodecode, data.data.endnodecode];
        }
      }
      this.currentParent = data.parent;
      this.currentNode = data.data;
      if (!this.currentNode.beginnodecode) {
        this.currentNode.beginnodecode = 0;
      }
    },
    handleMultipleNode(nodes) {
      console.log("handleMultipleNode", nodes);
    },
    handleSubmit() {
      const params = JSON.parse(
        JSON.stringify(this.tree).replace(/children/g, "nodes")
      );
      this.reverseTransformTreeData(params);
      this.clearExtraNode(params);

      console.log(params);
      if (this.hasTree) {
        this.$refs.form.validate(valid => {
          if (valid) {
            services.updateSubtree(params).then(res => {
              this.$Message.success("更新成功!");
              this.getTreeData();
              this.currentNode = {};
            });
          }
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
    handleDeleteNodeImmediately() {
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
    },
    handleClickSplitSubnet() {},
    handleClickMergeSubnet() {}
  },
  watch: {
    autoAssign(value) {
      if (value) {
        this.currentNode.subtreebitnum = 0;
      }
    },
    "currentNode.endnodecode"(value) {
      if (this.currentParent) {
        const siblings = this.currentParent.children;
        const currentNode = this.currentNode;
        const index = siblings.findIndex(
          item => item.data.id === currentNode.id
        );
        const nextNode = this.currentParent.children[index + 1];
        nextNode.data.beginnodecode = value + 1;
        if (nextNode.data.endnodecode < value + 1) {
          nextNode.data.endnodecode = value + 1;
        }
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
    .btn-del {
      float: right;
      & + .btn-del {
        margin-right: 10px;
      }
    }
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