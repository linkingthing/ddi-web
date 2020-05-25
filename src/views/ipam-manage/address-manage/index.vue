<template>
  <div class="child-net-manage">   
    <IviewLoading v-if="loading" />

    <table-page 
      :data="tableData"
      :columns="columns"  
      @on-selection-change="handleSelecChange"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import { columns } from "./define";

export default {
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
          item.usedRatio = (1 - (item.unmanagedRatio || 0)) * 100;

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

    handleViewNet(data) {
      this.$router.push(`/address/ipam/subnets/${data.id}/nets`);
    }
  }
};
</script>