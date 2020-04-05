<template>
  <div class="priority">
    <table-page title="解析优先级" :data="list" :columns="columns" :paginationEnable="false">
      <template slot="top-right">
        <i-button type="success" size="large" @click="handleOpenCreate">级别调整</i-button>
      </template>
    </table-page>

    <common-modal :visible.sync="visible" title="编辑优先级" @confirm="handleSubmit">
      <Form>
        <FormItem label="访问控制列表" :label-width="120">
          <AccessControlSelect :value="currentAccess.id" @change="handleSelectAccessControl" />
          <Button type="success" @click="handleAddAccess">添加</Button>
        </FormItem>
        <FormItem label="（拖拽）优先级" :label-width="120">
          <draggable class="listContent" v-model="dragList">
            <transition-group>
              <div v-for="item in dragList" :key="item.id" class="listItem">
                <p>
                  {{item.name}}
                  <Icon type="ios-close" style="float:right;margin-top: 8px" @click="handleRemove(item.id)" />
                </p>
              </div>
            </transition-group>
          </draggable>
        </FormItem>
      </Form>
    </common-modal>
  </div>
</template>

<script>
import services from "@/services";
import AccessControlSelect from "@/components/AccessControlSelect";
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
    AccessControlSelect
  },

  props: {},
  data() {
    return {
      visible: false,
      list: [],
      dragList: [],
      columns: [
        {
          type: "index",
          title: "优先级别",
          width: 140
        },
        {
          title: "控制列表",
          key: "name",
          align: "center"
        },
        {
          title: "客户",
          key: "IP",
          align: "center",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.acls
              }
            });
          }
        },
        {
          title: "排序",
          key: "IP",
          align: "center",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.acls
              }
            });
          }
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 160,
          render: (h, { row }) => {
            return h("div", [
              row.name !== "default" &&
                h("btn-del", {
                  on: {
                    click: () => this.handleDelete(row.id)
                  }
                })
            ]);
          }
        }
      ],
      currentAccess: {}
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      services.getPriority().then(res => {
        this.list = res.data.acls || [];
      });
    },
    handleOpenCreate() {
      this.visible = true;
      this.dragList = Array.isArray(this.list) ? [...this.list] : [];
    },
    handleSelectAccessControl(id, item) {
      this.currentAccess = item;
    },
    handleAddAccess() {
      if (this.dragList.find(item => item.id === this.currentAccess.id)) {
        return;
      }
      this.dragList.push(this.currentAccess);
    },
    handleRemove(id) {
      this.dragList = this.dragList.filter(item => item.id !== id);
    },
    handleSubmit() {
      const params = {
        aclids: this.dragList.map(item => item.id)
      };
      if (this.dragList.length === 0) {
        this.$Message.info("请选择访问列表");
        return;
      }
      if (this.list && Array.isArray(this.list) && this.list.length > 0) {
        services.updatePriority(params).then(() => {
          this.getDataList();
          this.visible = false;
          this.dragList = [];
        });
      } else {
        services.createPriority(params).then(() => {
          this.getDataList();
          this.visible = false;
          this.dragList = [];
        });
      }
    },
    handleDelete(id) {
      const aclids = this.list.map(item => item.id);
      const index = aclids.indexOf(id);
      aclids.splice(index, 1);
      if (aclids.length > 0) {
        services.updatePriority({ aclids }).then(() => {
          this.getDataList();
        });
      } else {
        services.deletePriority().then(() => {
          this.getDataList();
        });
      }
    }
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.listContent {
  .listItem {
    cursor: pointer;
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
    padding: 0 10px;
  }
  .listItem:hover {
    background: #ddd;
  }
}
</style>