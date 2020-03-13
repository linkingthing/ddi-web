<template>
  <div class="viewManage">
    <table-page title="视图管理" :data="list" :columns="columns" :paginationEnable="false">
      <template slot="top-right">
        <i-button type="success" icon="md-add" @click="handleOpenCreate">新建</i-button>
      </template>
    </table-page>

    <createView ref="deviceRef" @onCreateSuccess="getView" :maxPriority="list.length"></createView>
    <editView ref="analysis2Ref" @onEditSuccess="getView" :maxPriority="list.length"></editView>
  </div>
</template>

<script>
import createView from "./createView";
import editView from "./editView";
import services from "@/services";

export default {
  name: "deviceMonitor",
  data() {
    return {
      columns: [
        {
          title: "名称",
          key: "name",
          align: "center"
        },
        {
          title: "访问控制列表",
          key: "acls",
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
          title: "优先级",
          key: "priority",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 160,
          render: (h, { row }) => {
            return h("div", [
              h("btn-edit", {
                on: {
                  click: () => this.goConfig1(row.id, row)
                }
              }),
              row.name !== "default" &&
                h("btn-del", {
                  on: {
                    click: () => this.delect(row.id)
                  }
                })
            ]);
          }
        }
      ],
      list: [],
      id: "",
      name: "",
      remove: "",
      modal1: false,
      priority: "",
      acls: []
    };
  },
  components: {
    createView,
    editView
  },
  mounted() {
    this.getView();
  },
  methods: {
    handleOpenCreate() {
      this.$refs.deviceRef.openConfig();
    },
    goConfig1(a, b) {
      this.$refs.analysis2Ref.openConfig(a, b);
    },
    getView() {
      let _self = this;
      services
        .getViewList()
        .then(function(res) {
          _self.list = res.data.data;
          for (var key in _self.list) {
            _self.id = _self.list[key].id;
            _self.name = _self.list[key].name;
            _self.priority = _self.list[key].priority;
            _self.acls = _self.list[key].acls;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },

    // 删除
    delect(data) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteViewById(data)
            .then(res => {
              this.$Message.success("删除成功");
              this.getView();
            })
            .catch(err => {
              this.$Message.success("删除失败");
            });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
