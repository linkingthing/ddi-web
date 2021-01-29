<template>
  <div class="domainGroup">
    <table-page
      :loading="loading"
      :data="list"
      :columns="columns"
      :total="total"
      :current.sync="current"
    >
      <template slot="top-right">
        <i-button
          v-if="$hasPermission('domaingroup', 'POST')"
          type="primary"
          @click="handleOpenCreate"
        >新建</i-button>
      </template>
    </table-page>
    <Modal
      :links="paramsLinks"
      :visible.sync="visible"
      @success="getDataList"
    />
  </div>
</template>

<script>
import Modal from "./modules/modal";
export default {
  components: {
    Modal
  },
  props: {},
  data() {
    return {
      loading: false,
      visible: false,
      list: [],
      columns: [{
        title: "组名称",
        key: "name"
      }, {
        title: "备注",
        key: "comment"
      }, {
        title: "操作",
        key: "",
        render: (h, { row }) => {
          return h("div", [
            [h("btn-edit", {
              on: {
                click: () => {
                  this.handleEdit(row);
                }
              }
            }), h("btn-del", {
              on: {
                click: () => {
                  this.handleDelete(row);
                }
              }
            })]
          ])
        }
      }],
      links: {},
      paramsLinks: {},
      total: 0,
      current: 0
    };
  },
  computed: {},
  watch: {
    current() {
      this.getDataList();

    }
  },
  created() {
  },
  mounted() { },
  methods: {
    getDataList() {
      const params = {
        page_num: this.current,
        page_size: 10
      };
      this.loading = true;
      this.$get({ ...this.$getApiByRoute(), params }).then(({ data, links, pagination }) => {
        this.links = links;
        this.list = data;
        this.total = pagination.total;
        this.current = pagination.current;
      }).finally(() => this.loading = false);
    },
    handleOpenCreate() {
      this.paramsLinks = this.links;
      this.visible = true;
    },
    handleEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    handleDelete({ links }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(() => {
            this.getDataList();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>