<template>
  <div class="content-top ">
    <div class="organize">
      <div class="organize-tree">
        <div class="organize-tree-header">
          <div class="organize-tree-header-title">
            <h1>组织机构</h1>
            <p>选中机构即可编辑该机构的子机构</p>
          </div>

          <import-export-csv
            v-if="$hasPermission('semantic', 'POST')"
            :links="links"
            @on-import-success="onImportSuccess"
            resource="机构"
          >
            <button>导出</button>
          </import-export-csv>

        </div>
        <div class="organize-tree-content">
          <Spin
            fix
            v-if="treeLoading"
          >
            <Icon
              type="ios-loading"
              size=18
              class="demo-spin-icon-load"
            ></Icon>
            <div>Loading</div>
          </Spin>
          <template v-else>
            <tree
              v-if="treeData.length"
              :setting="setting"
              :nodes="treeData"
              @onClick="handleSelectNode"
            />

            <div
              class="organize-tree-add"
              v-else
            >
              <template v-if="$hasPermission('semantic', 'POST')">
                <p>暂无机构，请点击添加</p>
                <Button
                  type="primary"
                  style="width: 126px"
                  @click="handleClickOpenCreate"
                >添加</Button>
              </template>
              <template v-else>
                <p>暂无机构</p>

              </template>
            </div>
          </template>
        </div>

      </div>
      <div
        class="organize-content"
        v-if="!noData"
      >
        <div class="organize-content-header">
          <h3>
            <CommonEditText
              v-model="currentNode.name"
              @change="(name) =>handleNameChange(name, currentId, currentNode)"
            /> <span>（双击可修改名称）</span>
          </h3>
          <div class="organize-content-header-operate">

            <Button
              type="primary"
              @click="handleClickAddChildrenNodes"
            >添加数量</Button>
          </div>
        </div>
        <div class="organize-content-table">

          <table class="m-table">
            <thead>
              <tr>
                <th
                  align="left"
                  width="80"
                >序号</th>
                <th align="left">子机构（双击可修改名称）</th>
                <th width="80">操作</th>
              </tr>
            </thead>
            <template v-if="currentChildenNodeList.length">
              <tbody style="max-height: calc(100vh - 358px);">
                <tr
                  v-for="(node,index) in currentChildenNodeList"
                  :key="node.id"
                >
                  <td width="80">{{index+1}}</td>
                  <td>
                    <CommonEditText
                      v-model="node.name"
                      @change="(name)=>handleNameChange(name, node.id, node)"
                    />
                  </td>
                  <td width="80">
                    <btn-del @click="handleClickDelete(node.id)" />
                  </td>
                </tr>
              </tbody>
            </template>
            <tr v-else>
              <td
                colspan="3"
                align="center"
              >暂无数据</td>
            </tr>

          </table>

        </div>
        <div class="organize-content-operate">
          <Button
            type="primary"
            style="width: 160px"
            @click="handleSave"
          >保存</Button>
        </div>
      </div>
    </div>

    <common-modal
      :visible.sync="dialogVisible"
      title="新建组织机构"
      :width="413"
      :loading="loading"
      @confirm="handleConfirm('formInline')"
    >
      <Form
        ref="formInline"
        label-position="left"
        :label-width="115"
        :label-colon="true"
        :rules="rules"
        :model="formModel"
      >
        <common-form
          :form-model="formModel"
          :form-item-list="formItemList"
        />
      </Form>
    </common-modal>
  </div>
</template>

<script>
import tree from "vue-giant-tree";
import { list2Tree } from "@/util/common";
import CommonEditText from "@/components/CommonEditText";
import { cloneDeep } from "lodash";

export default {
  components: {
    tree,
    CommonEditText
  },
  props: {},
  data() {
    this.setting = {
      treeId: "id",
      // view: {
      //   showIcon: false,

      //   addDiyDom: function (treeId, treeNode) {
      //     console.log(treeId, treeNode)
      //     const icoObj = document.querySelector("#" + treeNode.tId + "_span");
      //     console.dir(icoObj)
      //     const element = document.createElement("span");
      //     element.innerText = '123123';
      //     element.classList.add("text")
      //     icoObj.appendChild(element)

      //   }
      // }


    };

    this.rules = {
      name: [{
        required: true,
        message: "请输入集团名称",
      }],
      count: [{
        required: true,
        message: "请输入机构数量",
      }, {
        pattern: /^[1-9]\d*$/,
        message: "请输入正整数"
      }],
    };

    return {
      treeLoading: false,
      dialogVisible: false,
      loading: false,
      formModel: {
        name: "",
        count: ""
      },
      treeData: [],
      noData: false,
      links: {},
      currentId: "",
      currentNode: {},
      isAddNode: false,
      currentChildenNodeList: [],
      updateQueue: []
    };
  },

  computed: {
    formItemList() {
      if (this.isAddNode) {
        return [{
          label: "机构数量",
          model: "count",
          type: "input"
        }];
      } else {
        return [{
          label: "集团名称",
          model: "name",
          type: "input"
        }, {
          label: "一级机构数量",
          model: "count",
          type: "input"
        }];
      }

    }
  },
  watch: {
    currentId: {
      immediate: true,
      handler() {
        this.currentChildenNodeList = this.currentNode.children || [];
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$refs["formInline"].resetFields();
      }
    }
  },
  created() {
    const { currentNodeId } = this.$route.query;
    if (currentNodeId) {
      this.currentId = currentNodeId;
    }
    this.getSemanticList();
  },
  mounted() { },
  methods: {
    onImportSuccess() {
      this.getSemanticList()
    },
    getSemanticList() {
      this.treeLoading = true;
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/semantics" }).then(({ data }) => {
        console.log(data)
        if (Array.isArray(data) && data.length) {
          const [{ links }] = data;
          this.links = links;
          this.getSemantic(links)
        } else {
          this.noData = true;
          this.treeLoading = false;
        }
      }).catch(() => {
        this.treeLoading = false;
      })
    },
    getSemantic(links) {
      this.$post({ url: `${links.self}?action=list_tree` }).then((data) => {
        this.treeData = list2Tree(data, {
          pid: "root",
          pidField: "parentId",
          children: "children"
        });
        if (!this.currentId && data.length) {
          this.currentId = data[0].id
        }
        this.currentNode = cloneDeep(data.find(item => item.id === this.currentId)) || {};
        this.currentChildenNodeList = this.currentNode.children || [];

      }).finally(() => {
        this.treeLoading = false;
      })

    },
    handleSelectNode($, id, node,) {
      this.currentId = node.id
      this.currentNode = cloneDeep(node);
      this.$router.replace({
        query: {
          ...this.$route.query,
          currentNodeId: node.id
        }
      })
    },
    handleClickOpenCreate() {
      this.dialogVisible = true;
      this.$refs["formInline"].resetFields();
    },
    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        console.log(this.$refs[name])

        if (valid) {
          if (this.isAddNode) {
            this.createSubnode(this.links.self, {
              id: this.currentId,

            }, this.formModel.count)

          } else {
            const params = {
              name: this.formModel.name,
              parentId: "root",
              rootId: "root"
            }
            this.$post({ url: "/apis/linkingthing.com/ipam/v1/semantics", params }).then(({ links, id, rootId }) => {
              this.createSubnode(links.self, { id, rootId, parentId: id }, this.formModel.count)
            }).catch(err => {
              this.$Message.error(err.response.data.message)
            })
          }

        }
      })
    },
    createSubnode(url, { id, rootId, parentId }, length) {
      const params = {
        semanticId: id,
        semanticNodes: Array.from({ length }, function () {
          return {
            name: "组织机构",
            parentId,
            rootId
          }
        })

      };
      this.$post({ url: `${url}?action=create_subnode`, params })
        .then(() => {
          this.$Message.success("创建成功")
          this.getSemanticList();
          this.dialogVisible = false;
          this.noData = false;
        }).catch(err => {
          this.$Message.error(err.response.data.message)
        })
    },

    handleClickAddChildrenNodes() {
      this.isAddNode = true;
      this.dialogVisible = true;
    },

    handleNameChange(name, id) {
      const nodeIsExit = this.updateQueue.find(item => item.id === id)
      if (nodeIsExit) {
        nodeIsExit.name = name;
      } else {
        this.updateQueue.push({
          name,
          id
        })
      }
    },
    handleClickDelete(id) {

      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>请再次确定是否删除该记录</p>',
        loading: true,
        onOk: () => {
          const params = {
            semanticId: this.currentId,
            semanticNodes: [{
              id,
              name: ""
            }]
          }
          this.$post({ url: `${this.links.self}?action=delete_subnode`, params }).then(() => {
            this.$Modal.remove();
            this.$Message.success("删除成功");
            this.updateQueue = [];
            this.getSemanticList();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          })
        }
      });

    },
    handleSave() {
      const params = {
        semanticId: "",
        semanticNodes: this.updateQueue
      }
      this.$post({ url: `${this.links.self}?action=update_subnode`, params }).then(res => {
        this.$Message.success("修改成功");
        this.updateQueue = [];
        this.getSemanticList();
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      })
    }
  }
};
</script>

<style lang="less" scoped>
.organize {
  display: flex;
  flex: 1;
  padding: 24px;
  .organize-tree {
    width: 330px;

    background: #f6f6f6;
    border-radius: 6px;
    display: flex;
    flex-direction: column;

    .organize-tree-header {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      background: #ebebeb;
      border-radius: 6px 6px 0px 0px;
      .organize-tree-header-title {
        display: flex;
        flex-direction: column;
        flex: 1;
        line-height: 1.3;
      }
      h1 {
        color: #333;
        font-size: 14px;
      }

      p {
        color: #777;
        font-size: 12px;
      }

      button {
        float: right;
        width: 44px;
        height: 26px;
        background: #ffffff;
        border-radius: 4px;
        font-size: 12px;
        color: #999;
        cursor: pointer;
      }
    }

    .organize-tree-content {
      padding: 16px;
      flex: 1;
      overflow: auto;

      .organize-tree-add {
        color: #999;
        font-size: 12px;
        margin-top: 100px;
        text-align: center;
        p {
          margin-bottom: 12px;
        }
      }
    }
  }

  .organize-content {
    padding: 10px 0 0 30px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .organize-content-header {
      display: flex;
      line-height: 1;
      align-items: center; //flex-end;
      margin-bottom: 12px;
      h3 {
        color: #333;
        font-size: 24px;
      }
      span {
        color: #888;
        font-size: 14px;
      }
      .organize-content-header-operate {
        margin-left: auto;
        .ivu-btn {
          margin-left: 20px;
        }
      }
    }

    .organize-content-table {
      margin-bottom: 30px;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
    }
  }
}
</style>