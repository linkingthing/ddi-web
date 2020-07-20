<template>
  <div class="option-config">
    <table-page
      title="OPTION列表"
      :data="tableData"
      :total="tableData.length"
      :columns="columns"
    >
      <template slot="top-right">
        <Button
          type="primary"
          @click="handleAdd"
          class="top-button button-add"
        >
          新建
        </Button>
      </template>
    </table-page>

    <Edit
      :visible.sync="showEdit"
      :links="paramsLinks"
      @confirmed="handleSaved"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import Edit from "./edit";

export default {
  components: {
    Edit
  },

  data() {
    return {
      tableData: [],
      columns: [
        {
          title: "名称",
          key: "name",
          align: "left"
        },
        {
          title: "匹配条件",
          key: "regexp",
          align: "center"
        },
        {
          title: "操作",
          align: "right",
          render: (h, { row }) => {
            return h("div", [h("btn-edit", {
              on: {
                click: () => {
                  this.handleEdit(row);
                }
              }
            }), h("btn-del", {
              on: {
                click: () => {
                  this.handleDel(row);
                }
              }
            })]);
          }
        }
      ],
      showEdit: false,
      links: {},
      paramsLinks: {}
    };
  },

  mounted() {

    this.getDataList();
  },

  methods: {

    getDataList() {
      this.$getData().then(({ data }) => {
        this.tableData = data;
      }).catch(err => err);
    },


    handleAdd() {
      this.showEdit = true;

      this.paramsLinks = {};
    },


    handleEdit({ links }) {
      this.showEdit = true;
      this.paramsLinks = links;
    },
    handleDel({ links }) {
      this.$Modal.confirm({
        title: "您确定要删除当前数据吗？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(res => {
            this.$Message.info("删除成功");
            this.getDataList();
          }).catch(err => {
            this.$Message.error(err.message);
          });
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });
    },
    handleSaved() {
      this.getDataList();
    }
  }
};
</script>