<template>
  <div class="option-config">
    <table-page
      title="OPTION列表"
      :loading="loading"
      :data="tableData"
      :total="total"
      :columns="columns"
      :current.sync="current"
    >
      <template slot="top-right">
        <Button
          v-if="$hasPermissionCreate('clientclass')"
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
      loading: false,
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
        },
        {
          title: "操作",
          render: (h, { row }) => {
            if (this.$hasPermissionCreate("clientclass")) {
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
            } else {
              h("div");
            }
          }
        }
      ],
      showEdit: false,
      links: {},
      paramsLinks: {},
      total: 0,
      current: 0
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
      this.$getData(params).then(({ data, pagination }) => {
        this.tableData = data;
        this.total = pagination.total;
      }).catch(err => err).finally(() => this.loading = false);
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
            this.$Message.error(err.response.data.message);
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