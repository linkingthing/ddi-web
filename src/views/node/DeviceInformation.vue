<template>
  <div class="DeviceInformation">
    <div class="qps">
      <span class="qps-title">QPS</span>
      <span class="count">{{ qps }}</span>
      <span>个/秒</span>
    </div>
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
      ]
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.wrapper {
}
</style>