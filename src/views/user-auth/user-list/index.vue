<template>
  <div class="viewManage">
    <table-page
      :loading="loading"
      :data="list"
      :columns="columns"
      :current.sync="current"
      :total="total"
    >
      <template slot="top-right">
        <i-button
          type="primary"
          @click="handleOpenCreate"
        >创建用户</i-button>
      </template>
    </table-page>

    <ViewModal
      :visible.sync="visible"
      :links="paramsLinks"
      @success="getDataList"
    />
    <change-password
      :username="username"
      :visible.sync="cpvisible"
      action="resetPassword"
    />
  </div>
</template>

<script>


import ViewModal from "./modules/user-group-modal";
import ChangePassword from "@/components/ChangePassword";

export default {
  name: "deviceMonitor",
  components: {
    ChangePassword,
    ViewModal
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          title: "用户名称",
          key: "username",
          align: "left"
        },
        {
          title: "备注",
          key: "comment",
        },
        {
          title: "创建时间",
          key: "creationTimestamp",

          render: (h, { row }) => {
            return h("div", this.$trimDate(row.creationTimestamp));
          }
        },
        {
          title: "操作",
          key: "action",
          width: 220,
          render: (h, { row }) => {
            return h("div", [
              h("btn-reset", {
                on: {
                  click: () => this.handleChangePassword(row)
                }
              }),
              h("btn-edit", {
                on: {
                  click: () => this.handleEdit(row)
                }
              }),
              h("btn-del", {
                on: {
                  click: () => this.delect(row)
                }
              })

            ]);
          }
        }
      ],
      list: [],
      visible: false,
      links: {},
      paramsLinks: {},
      cpvisible: false,
      username: "",

      current: 0,
      total: 0
    };
  },
  watch: {
    current() {
      this.getDataList();
    }
  },
  methods: {
    getDataList() {
      const params = {
        page_num: this.current,
        page_size: 10
      };
      this.loading = true;
      this.$getData(params, "/auth/auth/users").then(({ data, links, pagination }) => {
        this.links = links;
        this.list = data;
        this.total = pagination.total;
        this.current = pagination.pageNum;
      }).finally(() => this.loading = false);
    },
    handleOpenCreate() {
      this.visible = true;
      this.paramsLinks = this.links;
    },
    handleChangePassword({ username }) {
      this.username = username;
      this.cpvisible = true;
    },
    handleEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    // 删除
    delect({ links }) {
      this.$Modal.confirm({
        title: "提示",
        content: "如果删除该用户，所有授权将移除，您确定要删除该用户吗？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(() => {
            this.$Message.info("删除成功");
            this.getDataList();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        }
      });
    },
    handleMove({ priority, links, ...rest }, type) {
      let count = priority;
      if (type === "up") {
        count -= 1;
      } else {
        count += 1;
      }
      this.$put({
        url: links.update,
        params: { priority: count, ...rest }
      }).then(() => {
        this.$Message.success("更新成功");
        this.getDataList();
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    }
  }
};
</script>

<style scoped>
</style>
