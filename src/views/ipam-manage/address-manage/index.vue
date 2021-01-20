<template>
  <div class="address-manage">
    <IviewLoading v-if="loading" />

    <table-page
      :data="tableData"
      :columns="columns"
      @on-selection-change="handleSelecChange"
      :total="total"
      :current.sync="current"
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
      editData: null,
      total: 0,
      current: 0
    };
  },
  watch: {
    current() {
      this.handleQuery();
    }
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      this.selectedData = [];

      try {
        const params = {
          page_num: this.current,
          page_size: 10
        };
        let { data, pagination } = await this.$get({ url: this.url, params });

        this.tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);
          item.usedRatio = parseFloat(parseFloat((1 - (item.unmanagedRatio || 0))).toFixed(2));
          return item;
        });

        this.total = pagination.total;

      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    },

    handleSelecChange(res) {
      this.selectedData = [...res];
    },

    handleViewNet(data) {
      this.$router.push({
        name: "ipam-network-interface",
        params: {
          scannedsubnetsId: data.id
        },
        query: {
          subnet: data.ipnet
        }
      });
    },
    handleGoIpHistory(data) {
      this.$router.push({
        name: "ipam-network-ipassets",
        params: {
          scannedsubnetsId: data.id
        },
        query: {
          subnet: data.ipnet
        }
      });
    }
  }
};
</script>