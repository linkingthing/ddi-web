<template>
  <div class="redirect">
    <table-page
      title="重定向"
      :loading="loading"
      :data="list"
      :columns="columns"
      :total="total"
      :current.sync="current"
    >
      <template slot="top-right">
        <i-button
          type="primary"
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
      loading: false,
      columns: [
        {
          title: "域名",
          key: "name",
          align: "left"
        },
        {
          title: "记录类型",
          key: "rrType"
        },
        {
          title: "记录值",
          key: "rdata",
        },
        {
          title: "TTL",
          key: "ttl",
        },
        {
          title: "重定向方式",
          key: "redirecttype",
          render: (h, { row }) => {
            return h("div", row.redirecttype === "localzone" ? "强制重定向" : row.redirecttype)
          }
        },
        {
          title: "操作",
          key: "action",
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
      acls: [],
      total: 0,
      current: 0
    };
  },
  watch: {
    current() {
      this.getView();
    }
  },
  created() {
    this.id = this.$route.params.id;
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
      const params = {
        page_num: this.current,
        page_size: 10
      };
      this.loading = true;
      services
        .geRedirectionsByViewId(this.id, params)
        .then(function ({ data, pagination }) {
          _self.list = data;
          _self.total = pagination.total;
        })
        .catch(function (err) {
          console.log(err);
        }).finally(() => this.loading = false);
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
            .catch((err) => {
              this.$Message.error(err.message);
            });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>