<template>
  <div class="ControllerDashboard dashboard">
    <h1 class="d-title">
      节点
      <NodeSelect
        type="controller"
        v-model="node"
      />

    </h1>
    <div class="card-list">
      <Card title="CPU利用率">
        <line-bar
          is-percent
          line-theme="color1"
          :labels="cpuLabels"
          :values="cpuValues"
          series-name="CPU利用率"
        />
      </Card>

      <Card title="内存利用率">
        <line-bar
          is-percent
          line-theme="color2"
          :labels="memoLabels"
          :values="memoValues"
          series-name="内存利用率"
        />
      </Card>

      <Card title="磁盘利用率">
        <line-bar
          is-percent
          line-theme="color3"
          :labels="diskLabels"
          :values="diskValues"
          series-name="磁盘利用率"
        />
      </Card>

      <Card title="网络流量(Bps)">
        <line-bar
          line-theme="color4"
          :labels="networkLabels"
          :values="networkValues"
          series-name="网络流量"
        />
      </Card>
    </div>

  </div>
</template>

<script>
import Card from "./Card";
import Line from "./Line";
import NodeSelect from "./modules/node-select";

import { valuesParser } from "./tools";

export default {
  name: "ControllerDashboard",
  components: { Card, "line-bar": Line, NodeSelect },
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
      diskValues: [],
      networkLabels: [],
      networkValues: []
    };
  },
  computed: {},
  watch: {
    node() {
      clearInterval(this.timer);
      this.init();
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    init() {
      this.getNodeInfo();
      this.timer = setInterval(() => {
        this.getNodeInfo();
      }, 10000);
    },
    getNodeInfo() {
      if (this.node.length) {
        this.$get(this.$getApiByRoute(`/monitor/metric/nodes/${this.node}`)).then(({ cpuUsage, discUsage, memoryUsage, network }) => {

          if (Array.isArray(cpuUsage)) {
            const [cpuLabels, cpuValues] = valuesParser(cpuUsage);
            this.cpuLabels = cpuLabels;
            this.cpuValues = cpuValues;
          } else {
            this.cpuLabels = [];
            this.cpuValues = [];
          }


          if (Array.isArray(memoryUsage)) {
            const [memoLabels, memoValues] = valuesParser(memoryUsage);
            this.memoLabels = memoLabels;
            this.memoValues = memoValues;
          } else {
            this.memoLabels = [];
            this.memoValues = [];
          }


          if (Array.isArray(discUsage)) {
            const [diskLabels, diskValues] = valuesParser(discUsage);
            this.diskLabels = diskLabels;
            this.diskValues = diskValues;
          } else {
            this.diskLabels = [];
            this.diskValues = [];
          }

          if (Array.isArray(network)) {
            const [networkLabels, networkValues] = valuesParser(network);
            this.networkLabels = networkLabels;
            this.networkValues = networkValues;
          } else {
            this.networkLabels = [];
            this.networkValues = [];
          }

        });
      }
    }

  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>