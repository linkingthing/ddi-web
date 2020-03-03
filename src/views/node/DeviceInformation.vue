<template>
  <div class="DeviceInformation">
    <Row>
      <i-col span="8" v-for="dash in dashboardList" :key="dash.type">
        <div>
          <my-chart :values="dash"></my-chart>
        </div>
      </i-col>
    </Row>

    <div class="line-graph">
      <div class="filter-wrapper">
        <div class="tab-device">
          <Tabs active-key="lineParams.type" @on-click="handleChangeType">
            <Tab-pane
              :name="dash.type"
              :label="dash.name"
              v-for="dash in dashboardList"
              :key="dash.type"
            ></Tab-pane>
          </Tabs>
        </div>
        <div class="date-pick-content">
          <date-picker @onSearch="handleSearch"></date-picker>
        </div>
      </div>

      <line-bar :values="usageData" :labels="dateData"></line-bar>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>

<script>
import services from "@/services";
import myChart from "./dashboard";
import line from "./line";
import datePicker from "@/components/datePicker";
import { dateFormat } from "@/util/common";
export default {
  components: {
    "my-chart": myChart,
    "line-bar": line,
    "date-picker": datePicker
  },
  props: {},
  data() {
    return {
      dashboardList: [
        {
          name: "CPU利用率",
          value: "0",
          type: "cpu"
        },
        {
          name: "内存利用率",
          value: "0",
          type: "mem"
        },
        {
          name: "磁盘利用率",
          value: "0",
          type: "disk"
        }
      ],
      lineParams: {
        node: "",
        type: "cpu",
        start: "",
        end: "",
        step: ""
      },
      usageData: [],
      dateData: [],
      spinShow: false
    };
  },
  mounted() {
    this.lineParams.node = this.$route.query.ip;
  },

  computed: {},
  methods: {
    getDeviceHistoryInfo(params) {
      this.spinShow = true;
      services.getDeviceHistoryInfo(params).then(res => {
        if (res.data.status === "success") {
          // optimize：一行代码解决
          this.dateData = Array.isArray(res.data.data.values)
            ? res.data.data.values.map(item =>
                dateFormat(item[0], "yyyy-MM-dd")
              )
            : [];
          this.usageData = Array.isArray(res.data.data.values)
            ? res.data.data.values.map(item => item[1])
            : [];
        }
        this.spinShow = false;
      });
    },
    handleChangeType(type) {
      this.lineParams.type = type;
    },
    handleSearch(options) {
      this.lineParams = {
        ...this.lineParams,
        ...options
      };
    }
  },
  watch: {
    lineParams: {
      handler(values) {
        this.getDeviceHistoryInfo(values);
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
.wrapper {
}
</style>