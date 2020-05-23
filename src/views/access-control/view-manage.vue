<template>
  <div class="viewManage">
    <table-page
      :data="list"
      :columns="columns"
      :pagination-enable="false"
    >
      <template slot="top-right">
        <i-button
          type="success"
          size="large"
          @click="handleOpenCreate"
        >新建</i-button>
      </template>
    </table-page>

    <createView
      ref="deviceRef"
      @onCreateSuccess="getView"
      :max-priority="list.length"
    />
    <editView
      ref="analysis2Ref"
      @onEditSuccess="getView"
      :max-priority="list.length"
    />
  </div>
</template>

<script>
import createView from "./createView";
import editView from "./editView";
import services from "@/services";

export default {
  name: "deviceMonitor",
  components: {
    createView,
    editView
  },
  data() {
    return {
      columns: [
        {
          title: "视图名称",
          key: "name",
          align: "left"
        },
        {
          title: "优先级",
          key: "priority",
          align: "center"
        },
        {
          title: "访问控制",
          key: "acls",
          align: "center",

          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.ips
              }
            });
          }
        },
        {
          title: "DNS64",
          key: "dns64",
          align: "center"
        },
        {
          title: "备注",
          key: "comment",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "right",
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
      links: {},
      paramsLinks: {}
    };
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
      services
        .getViewList()
        .then(res => {
          this.list = res.data.data;
        })
        .catch(function (err) {
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
              this.$Message.success(err.message);
            });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
