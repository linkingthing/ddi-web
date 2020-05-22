<template>
  <div class="redirect">
    <table-page
      title="重定向"
      :data="list"
      :columns="columns"
      :pagination-enable="false"
    >
      <template slot="top-right">
        <i-button
          type="success"
          size="large"
          @click="handleOpenCreate(id)"
        >新建</i-button>
      </template>
    </table-page>
    <createRedirect
      ref="ipRef"
      @onCreateSuccess="getView"
    />
    <editRedirect
      ref="linkRef"
      @onSuccess="getView"
    />
  </div>
</template>

<script>
import createRedirect from "./createRedirect";
import editRedirect from "./editRedirect";
import services from "@/services";

export default {
  name: "redirect",
  components: {
    createRedirect,
    editRedirect
  },
  data() {
    return {
      columns: [
        {
          title: "域名",
          key: "name",
          align: "left"
        },
        {
          title: "记录类型",
          key: "datatype",
          align: "center"
        },
        {
          title: "记录值",
          key: "rdata",
          align: "center"
        },
        {
          title: "TTL",
          key: "ttl",
          align: "center"
        },
        {
          title: "重定向方式",
          key: "redirecttype",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "right",
          width: 160,
          render: (h, { row }) => {
            return h("div", [
              h(
                "btn-edit",
                {
                  class: "k-btn",
                  on: {
                    click: () => this.handleOpenEdit(this.id, row.id, row)
                  }
                },
              ),
              h(
                "btn-del",
                {
                  class: "k-btn",
                  on: {
                    click: () => this.delect(row.id)
                  }
                },
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
  created() {
    this.id = this.$route.params.id;
  },
  mounted() {
    this.getView();
  },
  methods: {
    handleOpenCreate(data) {
      this.$refs.ipRef.openConfig(data);
    },
    handleOpenEdit(a, b, item) {
      this.$refs.linkRef.openConfig(a, b, { ...item });
    },
    getView() {
      let _self = this;
      services
        .geRedirectionsByViewId(this.id)
        .then(function (res) {
          _self.list = res.data.data;
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
            .deleteRedirection(this.id, data)
            .then(() => {
              this.$Message.success("删除成功");
              this.getView();
            })
            .catch(() => {
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