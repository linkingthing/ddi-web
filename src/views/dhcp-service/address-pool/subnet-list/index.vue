<template>
  <div class="address-pool">
    <IviewLoading v-if="loading" />

    <TablePagination
      title="地址池管理"
      :data="tableData"
      :pagination-enable="false"
      :columns="columns"
    >
      <template slot="top-right">
        <Button
          type="warning"
          @click="handleDelete"
          class="top-button"
        >
          删除
        </Button>
      </template>
    </TablePagination>
    <Edit
      :visible.sync="showEdit"
      @saved="handleSaved"
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
import { getAddressType } from "@/util/common";

export default {
  components: {
    TablePagination,
    Edit
  },

  data() {
    return {
      loading: true,
      keywords: "",
      tableData: [{
        subnet: "10.0.0.2"
      }],
      columns: columns(this),
      showEdit: false,
      editData: null,
    };
  },

  mounted() {

    this.$getData().then(res => {
      this.loading = false;
    }).catch().finally(() => {
      this.loading = false;
    })


  },

  methods: {

    async handleDelete(data) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

      }
      catch (err) {
        this.$$error(err.message || "删除失败！");
      }
      finally {
        this.loading = false;
      }
    },
    handleEdit() {
      this.showEdit = true;
    },
    handleSaved(a) {
      console.log(a);
    }
  }
};
</script>