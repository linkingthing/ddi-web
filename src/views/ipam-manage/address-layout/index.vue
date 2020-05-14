<template>
  <div class="layout-list">   
    <IviewLoading v-if="loading" />

    <TablePagination 
      :data="tableData"
      :pagination-enable="false"
      :columns="columns"  
      @on-selection-change="handleSelecChange"
    > 
      <template slot="top-right">
        <Button 
          type="primary" 
          @click="handleAdd" 
          class="top-button button-add"
        >
          添加
        </Button>
        <Button 
          type="primary" 
          @click="handleDelete" 
          class="top-button button-split"
        >
          删除
        </Button>
      </template>
    </TablePagination>
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";

import { columns } from "./define";

import { getAddressType } from "@/util/common";

export default {
  components: {
    TablePagination
  },

  data() {
    return {
      loading: true,
      url: this.$getApiByRoute().url,
      tableData: [],
      columns: columns(this),
      selectedData: []
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
        let res = await this.$get({ url: this.url });
        console.log(res);
        
        this.tableData = res.map(item => {
          const segments = item.item.segmentWidth;

          item.segments = segments.join("-");
          item.blocks = Math.pow(2, segments[segments.length - 1]);
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

    handleViewLayouts(data) {
      this.$router.push(`/ipam/plans/${data.id}/layouts`);
    },

    handleAdd() {},

    handleViewNetDetail() {},

    handleSymbolManage() {},

    handleEdit() {},

    handleSaved() {
      this.handleQuery();
    },

    async handleDelete(data) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        this.loading = true;

        // const action = getAddressType(data.subnet) === "ipv4" ? "deleteIPv4ChildNet" : "deleteIPv6ChildNet";
        
        // let { message, status } = await services[action](data.subnet_id);

        // status = +status;

        // if (status === 200 || status === 204) {
        //   this.$$success("删除成功！");

        //   this.handleQuery();
        // }
        // else {
        //   Promise.reject({ message });
        // }
      }
      catch (err) {
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