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
          :labels="cpuLabels"
          :values="cpuValues"
          series-name="CPU利用率"
        />
      </Card>

      <Card title="内存利用率">
        <line-bar
          is-percent
          line-theme="purple"
          :labels="memoLabels"
          :values="memoValues"
          series-name="内存利用率"
        />
      </Card>

      <Card title="磁盘利用率">
        <line-bar
          is-percent
          line-theme="brown"
          :labels="diskLabels"
          :values="diskValues"
          series-name="磁盘利用率"
        />
      </Card>

      <Card title="网络流量">
        <line-bar
          line-theme="brown"
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
      }, 3000);
    },
    getNodeInfo() {
      if (this.node.length) {
        this.$get(this.$getApiByRoute(`/monitor/metric/nodes/${this.node}`)).then(({ cpuUsage, discUsage, memoryUsage, network }) => {

          const [cpuLabels, cpuValues] = valuesParser(cpuUsage);
          this.cpuLabels = cpuLabels;
          this.cpuValues = cpuValues;

          const [memoLabels, memoValues] = valuesParser(memoryUsage);
          this.memoLabels = memoLabels;
          this.memoValues = memoValues;

          const [diskLabels, diskValues] = valuesParser(discUsage);
          this.diskLabels = diskLabels;
          this.diskValues = diskValues;

          const [networkLabels, networkValues] = valuesParser(network);
          this.networkLabels = networkLabels;
          this.networkValues = networkValues;

        });
      }
    }

  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>