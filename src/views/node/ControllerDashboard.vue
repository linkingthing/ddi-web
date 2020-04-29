<template>
  <div class="ControllerDashboard dashboard">
    <h1 class="d-title">DNS节点信息</h1>

    <Row
      type="flex"
      justify="space-between"
      style="margin-bottom: 50px"
    >
      <i-col span="11">
        <HostInfo :ip="node"/>
      </i-col>
      <i-col span="11">
        <Card title="CPU利用率">
          <line-bar
            :labels="cpuLabels"
            :values="cpuValues"
          />
        </Card>
      </i-col>
    </Row>

    <Row
      type="flex"
      justify="space-between"
    >
      <i-col span="11">
        <Card title="内存利用率">
          <line-bar
            line-theme="purple"
            :labels="memoLabels"
            :values="memoValues"
          />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="磁盘利用率">
          <line-bar
            line-theme="brown"
            :labels="diskLabels"
            :values="diskValues"
          />
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import Card from "./Card";
import HostInfo from "./HostInfo";
import Line from "./Line";
import { getDeviceHistoryInfo } from "./tools";
import services from "@/services";

export default {
  name: "ControllerDashboard",
  components: { Card, HostInfo, "line-bar": Line },
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
    this.getList();
  },
  mounted() {
    const node = this.$route.query.ip;
    this.batchExecute(node);
    // this.timer = setInterval(() => {
    // this.batchExecute(node);
    // }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getList() {
      services
        .getServerList()
        .then(res => {
          this.node = res.data.data.find(item => item.role === "controller").ip;
          this.batchExecute(this.node);
        })
        .catch(err => err);
    },
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
          this[labelsField] = labels || [];
          this[valuesField] = values || [];
        });
      });
    }
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