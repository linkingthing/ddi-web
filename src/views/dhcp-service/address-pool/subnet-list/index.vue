<template>
  <div class="address-pool">   
    <TablePagination 
      title="地址池管理"
      :data="tableData"
      :columns="columns"/>
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";
import service from "@/services";
import { columns } from "./define";

export default {
  components: {
    TablePagination
  },

  data() {
    return {
      keywords: "",
      tableData: [],
      columns: columns(this),
      showEdit: false,
      editData: null,
      subnetId: null
    };
  },

  mounted() {
    this.subnetId = this.$route.query.subnetId;

    this.handleQuery();
  },

  methods: {
    async handleQuery() {
      try {
        let { status, data } = await service.getAddressPoolList(this.subnetId);

        if (status === 200) {
          this.tableData = data.data.map(item => {
            item.creationTime = item.embedded.creationTimestamp ? item.embedded.creationTimestamp.replace("T", " ") : "";

            return item;
          });
        }
        else {
          Promise.reject({ message: data.message || "查询失败！" });
        }
      }
      catch (err) {
        console.error(err);
      }
    },

    showDetail(row) {
      this.$router.push(`/dhcp-service/address-pool-list?subnetId=${row.id}&address=${row.ip}`);
    },

    async handleDelete(data) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        let res = await service.deleteAddressPool(this.subnetId, data.embedded.id);

        if (res.status === 200) {
          this.$$success("删除成功！");

          this.handleQuery();
        }
        else {
          Promise.reject({ message: res.message || "删除失败！" });
        }
      }
      catch (err) {
        console.error(err);
      }
    }
  }
};
</script>