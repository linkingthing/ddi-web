<template>
  <div class="DNSDashboard dashboard">
    <h1 class="d-title">DNS服务器
      <NodeSelect
        type="dns"
        v-model="node"
      />
    </h1>

    <div class="card-list">
      <Card title="QPS">
        <line-bar
          :labels="qpsLabels"
          :values="qpsValues"
        />
      </Card>

      <Card title="缓存命中率">
        <line-bar
          is-percent
          :labels="memoHitRateLabels"
          :values="memoHitRateValues"
        />
      </Card>

      <Card title="解析成功率">
        <line-bar
          is-percent
          multiple
          :labels="successRateLabels"
          :values="successRateValues"
        />
      </Card>

      <Card title="解析类型">
        <Pie :values="types" />
      </Card>

      <Card title="TOP请求域名">
        <Table
          :data="domains"
          :columns="topDomainColumns"
          style="padding-top: 30px"
        />
      </Card>

      <Card title="TOP请求IP">
        <Table
          :data="ips"
          :columns="topIPColumns"
          style="padding-top: 30px"
        />
      </Card>

    </div>

  </div>
</template>

<script>
import Card from "./Card";
import Line from "./Line";
import Pie from "./Pie";
import moment from "moment";
moment.locale("zh-cn");
import { valuesParser } from "./tools";
import NodeSelect from "./modules/node-select";

export default {
  name: "DNSDashboard",
  components: {
    Card,
    "line-bar": Line,
    Pie,
    NodeSelect
  },
  props: {
    ip: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      node: "",
      topDomainColumns: [
        {
          title: "排名",
          type: "index",
          align: "center"
        },
        {
          title: "域名",
          key: "key",
          align: "center"
        },
        {
          title: "统计次数",
          key: "doc_count",
          align: "center"
        }
      ],
      topIPColumns: [
        {
          title: "排名",
          type: "index",
          align: "center"
        },
        {
          title: "IP地址",
          key: "key",
          align: "center"
        },
        {
          title: "统计次数",
          key: "doc_count",
          align: "center"
        }
      ],
      timer: null,
      qpsLabels: [],
      qpsValues: [],
      ips: [],
      domains: [],
      types: [],
      status: [],
      successRateLabels: [],
      successRateValues: [],
      memoHitRateLabels: [],
      memoHitRateValues: []
    };
  },
  computed: {},
  watch: {
    node() {
      this.initDataRequest();
    }
  },
  created() { },
  mounted() {
    this.initDataRequest();
    // this.timer = setInterval(() => {
    //   this.initDataRequest();
    // }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    initDataRequest() {
      this.getQpsList();
      this.getDNSAnalysisStateData();
      this.getDNSAnalysisStateSuccessRecode();
      this.getMemoHitRateData();
      this.getDNSTop();
      this.getIPTop();
    },

    intercept() {
      const hasNode = !!this.node;
      return new Promise(resolve => {
        if (hasNode) {
          resolve();
        }
      });
    },

    baseGetNotParser(resource, params, labelField, valueField) {
      this.intercept().then(_ => {
        this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dnses/${this.node}/${resource}`) }).then(({ data }) => {
          const [{ ratios }] = data;

          const [labels] = valuesParser(ratios);

          this[labelField] = labels;
          this[valueField] = data;
        }).catch(err => err);
      });
    },

    baseGet(resource, params, labelField, valueField) {
      this.intercept().then(_ => {
        this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dnses/${this.node}/${resource}`) }).then(({ data: [{ ratios }] }) => {
          const [labels, value] = valuesParser(ratios);
          this[labelField] = labels;
          this[valueField] = value;
        }).catch(err => err);


      });
    },

    baseGetList(resource, params, field) {
      this.intercept().then(_ => {
        this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dnses/${this.node}/${resource}`) }).then(({ data }) => {
          this[field] = data;
        }).catch(err => err);
      });
    },

    getQpsList(params) {
      this.baseGet("qpses", params, "dhcpLpsLabels", "dhcpLpsValues");
    },

    getDNSAnalysisStateData(params) {
      this.baseGet("querytyperatios", params, "successRateLabels", "successRateValues");

    },

    getDNSAnalysisStateSuccessRecode(params) {
      this.baseGetNotParser("resolvedratios", params, "successRateLabels", "successRateValues");
    },

    getMemoHitRateData(params) {
      this.baseGet("cachehits", params, "memoHitRateLabels", "memoHitRateValues");
    },

    getDNSTop(params) {
      this.baseGetList("topdomains", params, "domains");

    },

    getIPTop(params) {
      this.baseGetList("topips", params, "ips");
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>