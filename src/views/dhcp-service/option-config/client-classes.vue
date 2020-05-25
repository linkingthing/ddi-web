<template>
  <div class="option-config">
    <table-page
      title="OPTION列表"
      :data="tableData"
      :pagination-enable="false"
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
      :links="links"
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
      links: null
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

      this.editData = null;
    },


    handleEdit({ links }) {
      this.showEdit = true;
      this.links = links;
    },
    handleDel() { },
    handleSaved() {
      this.getDataList();
    }
  }
};
</script>