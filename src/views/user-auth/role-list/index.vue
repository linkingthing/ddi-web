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
        >创建角色</i-button>
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
      loading: false,
      columns: [
        {
          title: "角色",
          key: "name",
          align: "left"
        },
        {
          title: "备注",
          key: "comment",
        },
        {
          title: "操作",
          key: "action",
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
      paramsLinks: {},

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
      this.$getData(params, "/auth/auth/roles").then(({ data, links, pagination }) => {
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
    handleEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    // 删除
    delect({ links }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(res => {
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
