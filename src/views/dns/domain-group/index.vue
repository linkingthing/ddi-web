<template>
  <div class="domainGroup">
    <table-page
      :data="list"
      :columns="columns"
      :total="list.length"
    >
      <template slot="top-right">
        <i-button
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
        align: "right",
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
      paramsLinks: {}
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getDataList();
  },
  mounted() { },
  methods: {
    getDataList() {
      this.$getDataAndLinks().then(({ data, links }) => {
        this.links = links;
        this.list = data;
      });
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