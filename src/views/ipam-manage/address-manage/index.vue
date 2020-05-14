<template>
  <div class="child-net-manage">   
    <IviewLoading v-if="loading" />

    <TablePagination 
      :data="tableData"
      :columns="columns"  
      @on-selection-change="handleSelecChange"
    > 
      <template slot="top-right">
        <Button 
          type="primary" 
          @click="handleManualScan" 
          class="top-button button-blue"
        >
          手动扫描
        </Button>
      </template>
    </TablePagination>

    <AutoScan 
      :visible.sync="showAutoScan"
      :data="selectedData"
      :url="url"
      @confirmed="handleQuery"
    />

    <ManualScan 
      :visible.sync="showManualScan"
      :data="currentData"
      :url="url"
      @confirmed="handleQuery"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";
import AutoScan from "./auto-scan";
import ManualScan from "./manual-scan";

import { columns } from "./define";

export default {
  components: {
    TablePagination,
    AutoScan,
    ManualScan
  },

  data() {
    return {
      loading: true,
      url: this.$getApiByRoute().url,
      tableData: [],
      columns: columns(this),
      selectedData: [],
      currentData: null,
      showAutoScan: false,
      showManualScan: false,
      editData: null
    };
  },

  mounted() {    
    this.handleQuery();    
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      this.selectedData = [];

      try {
        let { data } = await this.$get({ url: this.url });
        
        this.tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);
          item.subnet = item.subnet || "";

          return item;
        });
        
      } catch (err) {
        console.error(err);
          
        this.$$error(err.message || "数据请求错误！");
      }
      finally {        
        this.loading = false;
      }
    },

    handleSelecChange(res) {
      this.selectedData = [...res];
    },

    handleAutoScan() {
      this.showCreate = true;
    },

    handleManualScan(data) {
      this.showEdit = true;

      this.editData = { ...data };
    },

    handleViewNet(data) {
      this.$router.push(`/address/ipam/subnets/${data.id}/nets`);
    }
  }
};
</script>