<template>
  <div class="redirect">
    <table-page title="重定向" :data="list" :columns="columns" :paginationEnable="false">
      <template slot="top-right">
        <i-button type="primary" icon="md-add" @click="handleOpenCreate(id)">新建</i-button>
      </template>
    </table-page>
    <createRedirect ref="ipRef" @onCreateSuccess="getView"></createRedirect>
    <editRedirect ref="linkRef" @onSuccess="getView"></editRedirect>
  </div>
</template>

<script>
import createRedirect from "./createRedirect";
import editRedirect from "./editRedirect";
import services from "@/services";

export default {
  name: "redirect",
  data() {
    return {
      columns: [
        {
          title: "域名",
          key: "name",
          align: "center"
        },
        {
          title: "TTL",
          key: "ttl",
          align: "center"
        },
        {
          title: "记录类型",
          key: "datatype",
          align: "center"
        },
        {
          title: "记录值",
          key: "value",
          align: "center"
        },
        {
          title: "重定向方式",
          key: "redirecttype",
          align: "center",
          render: (h, { row }) => {
            return h(
              "div",
              row.redirecttype === "redirect" ? "直接重定向" : "NXDOMAIN重定向"
            );
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 120,
          render: (h, { row }) => {
            return h("div", [
              h(
                "i-button",
                {
                  class: "k-btn",
                  on: {
                    click: () => this.handleOpenEdit(this.id, row.id, row)
                  }
                },
                "编辑"
              ),
              h(
                "i-button",
                {
                  class: "k-btn",
                  on: {
                    click: () => this.delect(row.id)
                  }
                },
                "删除"
              )
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
    createRedirect,
    editRedirect
  },
  created() {
    this.id = this.$route.query.id;
  },
  mounted() {
    this.getView();
  },
  methods: {
    handleOpenCreate(data) {
      this.$refs.ipRef.openConfig(data);
    },
    handleOpenEdit(a, b, item) {
      this.$refs.linkRef.openConfig(a, b, item);
    },
    getView() {
      let _self = this;
      services
        .geRedirectionsByViewId(this.id)
        .then(function(res) {
          _self.list = res.data.data;
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
            .deleteRedirection(this.id, data)
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