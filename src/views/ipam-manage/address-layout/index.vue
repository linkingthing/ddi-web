<template>
  <div class="layout-list">   
    <IviewLoading v-if="loading" />

    <no-data-list
      v-if="!tableData.length"
      @add="handleCreate" 
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
          @click="handleCreate" 
          class="top-button"
        >
          添加规划
        </Button>
      </template>
    </TablePagination>

    <Create 
      :visible.sync="showCreate"
      :prefix="prefix"
      :mask-len="maskLen"
      @saved="handleConfirmed"
    />

    <Edit 
      :visible.sync="showPlanDetail"
      :segments="segmentWidths"
      :layout-id.sync="layoutId"
      :prefix="prefix"
      :mask-len="maskLen"
      @saved="handleConfirmed"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";
import Create from "./create";
import Edit from "./edit";

import { columns } from "./define";

export default {
  components: {
    TablePagination,
    Create,
    Edit
  },

  data() {
    return {
      loading: true,
      url: this.$getApiByRoute().url,
      tableData: [],
      columns: columns(this),
      showCreate: false,
      showPlanDetail: false,
      segmentWidths: [],
      layoutId: "",
      prefix: "",
      maskLen: "",
      currentData: {}
    };
  },

  async mounted() {
    await this.getPlanDetail();

    this.handleQuery();    
  },

  methods: {
    async getPlanDetail() {
      let temp = this.url.split("/");

      temp.splice(temp.length - 1, 1);

      let { prefix, maskLen } = await this.$get({ url: temp.join("/") });

      this.prefix = prefix;
      this.maskLen = maskLen;
    },

    async handleQuery() {
      this.loading = true;

      try {
        let { data } = await this.$get({ url: this.url });
        
        this.tableData = data.map(item => {
          const segments = item.segmentWidths;

          item.segments = segments.join("-");
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
    handleViewPlanDetail({ id, segmentWidths }) {
      this.showPlanDetail = true;
      this.segmentWidths = segmentWidths;
      this.layoutId = id;
    },

    handleConfirmed() {
      this.showPlanDetail = false;
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