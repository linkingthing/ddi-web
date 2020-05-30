<template>
  <div class="ControllerDashboard dashboard">
    <h1 class="d-title">Controller服务器</h1>
    <div class="card-list">
      <Card title="CPU利用率">
        <line-bar
          is-percent
          :labels="cpuLabels"
          :values="cpuValues"
        />
      </Card>

      <Card title="内存利用率">
        <line-bar
          is-percent
          line-theme="purple"
          :labels="memoLabels"
          :values="memoValues"
        />
      </Card>

      <Card title="磁盘利用率">
        <line-bar
          is-percent
          line-theme="brown"
          :labels="diskLabels"
          :values="diskValues"
        />
      </Card>

      <Card title="网络流量">
        <line-bar
          is-percent
          line-theme="brown"
          :labels="diskLabels"
          :values="diskValues"
        />
      </Card>
    </div>

  </div>
</template>

<script>
import Card from "./Card";
import Line from "./Line";
import { getDeviceHistoryInfo } from "./tools";

export default {
  name: "ControllerDashboard",
  components: { Card, "line-bar": Line },
  props: {},
  data() {
    return {
      node: "",
      timer: null,
      cpuLabels: [],
      cpuValues: [],
      memoLabels: [],
      memoValues: [],
      diskLabels: [],
      diskValues: []
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getNodeInfo()
  },
  mounted() {


  },
  beforeDestroy() {
  },
  methods: {
    getNodeInfo() {
      this.$get(this.$getApiByRoute("/omonitor/metric/nodes")).then(res => {
        console.log(res)
      })
    },

  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>