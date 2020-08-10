<template>
  <div class="viewManage">
    <table-page
      :data="list"
      :columns="columns"
      :total="list.length"
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
  </div>
</template>

<script>


import ViewModal from "./modules/user-group-modal";

export default {
  name: "deviceMonitor",
  components: {

    ViewModal
  },
  data() {
    return {
      columns: [
        {
          title: "用户名称",
          key: "username",
          align: "left"
        },
        {
          title: "备注",
          key: "comment",
          align: "center"
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          align: "center",

          render: (h, { row }) => {
            return h("div", this.$trimDate(row.creationTimestamp));
          }
        },
        {
          title: "操作",
          key: "action",
          align: "right",
          width: 220,
          render: (h, { row }) => {
            return h("div", [
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
      paramsLinks: {}
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$getData({}, "/auth/auth/ddiusers").then(({ data, links }) => {
        this.links = links;
        this.list = data;
      });
    },
    handleOpenCreate() {
      this.visible = true;
      this.paramsLinks = this.links;
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
            this.$Message.error(err.message);
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
