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
          @click="handleCreate" 
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

    <Create 
      :visible.sync="showCreate"
      @completed="handleQuery"
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
      loading: true,
      url: this.$getApiByRoute().url,
      tableData: [],
      columns: columns(this),
      selectedData: [],
      showCreate: false,
      showPlanDetail: false,
      currentData: null
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
          const segments = item.segmentWidths;

          item.segments = segments.join("-");

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
      this.$router.push(`/ipam/plans/${data.id}/layouts`);
    },

    handleCreate() {
      this.showCreate = true;
    },

    handleViewNetDetail(res) {
      this.$router.push({
        name: "ipam-address-plan-subnet",
        params: {
          plansId: this.$route.params.plansId,
          layoutsId: res.id
        },
        query: {
          layoutName: res.name
        }
      });
    },

    /**
     * 查看规划详情
     */
    handleViewPlanDetail(res) {
      this.showPlanDetail = true;
      this.currentData = res;
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

        if (this.selectedData.length > 1) {
          this.$$warning("只能删除一项！");

          return;
        }

        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        this.loading = true;
        
        await this.$delete({ url: this.url + "/" + this.selectedData[0].id });
        
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