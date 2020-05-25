<template>
  <div class="address-pool">
    <IviewLoading v-if="loading" />

    <TablePagination
      title="地址池管理"
      :data="tableData"
      :pagination-enable="false"
      :columns="columns"
    />
    <Edit
      :visible.sync="showEdit"
      :links="links"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";
import Edit from "./edit";

import { columns } from "./define";

export default {
  components: {
    TablePagination,
    Edit
  },

  data() {
    return {
      loading: true,
      keywords: "",
      tableData: [],
      columns: columns(this),
      showEdit: false,
      links: {},
      editData: null,
    };
  },

  mounted() {
    this.getDataList();
  },

  methods: {
    getDataList() {
      this.$getData().then(({ data }) => {
        this.loading = false;
        this.tableData = data;
      }).catch().finally(() => {
        this.loading = false;
      });

  },
  handleDelete({ links }) {
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
  handleEdit({ links }) {
    this.links = links;
    this.showEdit = true;
  }

}
};
</script>