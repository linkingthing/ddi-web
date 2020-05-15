<template>
  <div class="address-pool">  
    <IviewLoading v-if="loading" />

    <TablePagination 
      title="地址池管理"
      :data="tableData"
      :pagination-enable="false"
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
import { getAddressType } from "@/util/common";

export default {
  components: {
    TablePagination
  },

  data() {
    return {
      loading: true,
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

    this.$getData().then(res => {
      console.log(res)
      this.loading = false;

    });    
  },

  methods: {
    
    showDetail(row) {
      this.$router.push(`/address/dhcp-service/address-pool-list?subnetId=${row.subnet_id}&address=${row.subnet}`);
    },

    async handleDelete(data) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" }); 
        
        this.loading = true;

        const action = getAddressType(data.subnet) === "ipv4" ? "deleteIPv4ChildNet" : "deleteIPv6ChildNet";

        let { status, message } = await service[action](data.subnet_id);

        status = +status;

        if (status === 200 || status === 204) {
          this.$$success("删除成功！");

          this.handleQuery();
        }
        else {
          Promise.reject({ message });
        }
      }
      catch (err) {
        // console.log(err);
        
        // const text = err.message || "删除失败！";
        // console.log(text);

        console.error(err);

        this.$$error(err.message || "删除失败！");
      }
      finally {        
        this.loading = false;
      }
    }
  }
};
</script>