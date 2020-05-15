<template>
  <div class="plan-list">   
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
          class="top-button"
        >
          添加
        </Button>
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
      :url="url"
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

export default {
  components: {
    TablePagination,
    Edit
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      tableData: [],
      columns: columns(this),
      selectedData: [],
      showEdit: false
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
        
        this.tableData = res.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);

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

    handleViewLayouts(data) {
      this.$router.push(`/address/ipam/plans/${data.id}/layouts?prefix=${data.prefix}`);
    },

    handleAdd() {
      this.showEdit = true;
    },

    handleSaved() {
      this.handleQuery();
    },

    async handleDelete() {
      try {
        if (!this.selectedData.length) {
          this.$$warning("请选择要删除的项！");

          return;
        }

        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        this.loading = true;
        
        await this.$delete({ url: this.url + "/" + data.id });
        
        this.$$success("删除成功！");

        this.handleQuery();
      }
      catch (err) {
        console.error(err);

        if (err.message) {
          this.$$error(err.message);
        }
      }
      finally {
        this.loading = false;
      }
    }
  }
};
</script>