<template>
  <div class="admin-email">

    <table-page
      :loading="loading"
      :total="list.length"
      :data="list"
      :columns="columns"
    >
      <template slot="top-right">
        <div>
          <Button
            @click="handleOpenCreate"
            type="primary"
            style="position: relative; z-index: 115"
          >添加管理员邮箱</Button>
        </div>
      </template>
    </table-page>
    <AdminModal
      :visible.sync="visible"
      :links="paramsLinks"
      @success="getData"
    />
  </div>
</template>

<script>
import AdminModal from "./AdminModal";
export default {
  components: {
    AdminModal
  },
  props: {},
  data() {
    return {
      loading: false,
      list: [],
      links: {},
      visible: false,
      paramsLinks: {},
      columns: [
        {
          title: "管理员",
          key: "name",
          align: "left"
        },
        {
          title: "邮箱",
          key: "address",
          align: "left"
        },
        {
          title: "操作",
          key: "name",
          render: (h, { row }) => {
            return h("div", [
              h("btn-edit", {
                on: {
                  click: () => this.handleOpenEdit(row.links)
                }
              }),
              h("btn-del", {
                on: {
                  click: () => this.handleDelete(row.links)
                }
              })
            ]);
          }
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getData();
  },
  mounted() { },
  methods: {
    getData() {
      this.loading = true;
      this.$get(this.$getApiByRoute("/system/alarm/mailreceivers")).then(({ data, links }) => {
        this.list = data;
        this.links = links;
      }).finally(() => this.loading = false);
    },
    handleOpenCreate() {
      this.paramsLinks = this.links;
      this.visible = true;
    },
    handleOpenEdit(links) {
      this.paramsLinks = links;
      this.visible = true;
    },
    handleDelete({ remove }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          this.$delete({ url: remove }).then(() => {
            this.$Message.success("删除成功");
            this.getData();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          })
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.admin-email {
  margin-top: -90px;
}
</style>