<template>
  <div class="address-manage">

    <table-page
      :loading="loading"
      :data="tableData"
      :columns="columns"
      @on-selection-change="handleSelecChange"
      :total="total"
      :current.sync="current"
    >
      <div
        slot="neck"
        class="address-manage-head"
      >

        <CommonTab
          :active="String(active)"
          :tab-list="tabList"
          @change="(value) => { active = +value }"
        />
      </div>
    </table-page>
  </div>
</template>

<style lang="less">
@import "./index.less";
.address-manage-head {
  padding: 16px 26px 0;
}
</style>

<script>
import { columns } from "./define";
import CommonTab from "@/components/CommonTab";

export default {
  components: {
    CommonTab
  },
  data() {
    this.tabList = [{
      id: "4",
      label: "IPv4"
    }, {
      id: "6",
      label: "IPv6"
    }];

    return {
      active: "4",

      loading: false,
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
    },
    active(version) {
      this.$router.replace({
        query: { ...this.$route.query, version }
      });
      this.handleQuery();
    }
  },
  created() {
    const { version } = this.$route.query;
    if (version) {
      this.active = +version;
    }
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      this.selectedData = [];

      try {
        const params = {
          page_num: this.current,
          page_size: 10,
          version: this.active

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