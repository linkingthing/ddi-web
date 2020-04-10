<template>
  <div class="ControllerDashboard dashboard">
    <h1 class="d-title">Conroller服务器</h1>

    <Row type="flex" justify="space-between" style="margin-bottom: 50px">
      <i-col span="11">
        <HostInfo />
      </i-col>
      <i-col span="11">
        <Card title="CPU利用率">
          <line-bar :labels="cpuLabels" :values="cpuValues"></line-bar>
        </Card>
      </i-col>
    </Row>

    <Row type="flex" justify="space-between">
      <i-col span="11">
        <Card title="内存利用率">
          <line-bar lineTheme="purple" :labels="memoLabels" :values="memoValues"></line-bar>
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="磁盘利用率">
          <line-bar lineTheme="brown" :labels="diskLabels" :values="diskValues"></line-bar>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import Card from "./Card";
import HostInfo from "./HostInfo";
import Line from "./Line";
import Pie from "./Pie";
import { getDeviceHistoryInfo } from "./tools";

export default {
  name: "ControllerDashboard",
  components: { Card, HostInfo, "line-bar": Line, Pie },
  props: {},
  data() {
    return {
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
  created() {},
  mounted() {
    const node = this.$route.query.ip;
    this.batchExecute(node);
    this.timer = setInterval(() => {
      this.batchExecute(node);
    }, 3000);
  },
  methods: {
    batchExecute(node) {
      const batch = [
        {
          type: "cpu",
          labelsField: "cpuLabels",
          valuesField: "cpuValues"
        },
        {
          type: "mem",
          labelsField: "memoLabels",
          valuesField: "memoValues"
        },
        {
          type: "disk",
          labelsField: "diskLabels",
          valuesField: "diskValues"
        }
      ];

      batch.forEach(({ type, labelsField, valuesField }) => {
        getDeviceHistoryInfo({
          node,
          type
        }).then(([labels, values]) => {
          this[labelsField] = labels;
          this[valuesField] = values;
        });
      });
    }
  },
  watch: {},
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="less" scoped>
.dashboard {
  padding: 30px;
}
.d-title {
  font-size: 22px;
  color: #252422;
  margin-bottom: 50px;
}
</style>