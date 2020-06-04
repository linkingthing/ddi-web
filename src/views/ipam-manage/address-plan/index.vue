<template>
  <div class="plan-list">   
    <IviewLoading v-if="loading" />

    <no-data-list
      v-if="!tableData.length"
      @add="handleAdd"
      top="212" 
    />

    <TablePagination 
      v-else
      :data="tableData"
      :columns="columns"  
      :total="tableData.length"
    > 
      <template slot="top-right">
        <Button 
          type="primary" 
          @click="handleAdd" 
          class="top-button"
        >
          新建网络
        </Button>
      </template>
    </TablePagination>

    <Create 
      :visible.sync="showCreate"
      @saved="handleSaved"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";
import Create from "./create";

import { columns } from "./define";

export default {
  components: {
    TablePagination,
    Create
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      tableData: [],
      columns: columns(this),
      showCreate: false
    };
  },

  mounted() {    
    this.handleQuery();
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      try {
        let { data } = await this.$get({ url: this.url });
        
        this.tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);

          return item;
        });
      } catch (err) {
        this.$handleError(err); 
      }
      finally {        
        this.loading = false;
      }
    },

    handleViewLayouts(data) {
      this.$router.push(`/address/ipam/plans/${data.id}/layouts?prefix=${data.prefix}&maskLen=${data.maskLen}`);
    },

    handleAdd() {
      this.showCreate = true;
    },

    handleSaved() {
      this.showCreate = false;

      this.handleQuery();
    },

    async handleDelete({ id }) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        this.loading = true;
        
        await this.$delete({ url: this.url + "/" + id });
        
        this.$$success("删除成功！");

        this.handleQuery();
      }
      catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    }
  }
};
</script>