<template>
  <div class="DNSDashboard dashboard">
    <h1 class="d-title">DNS服务器
      <NodeSelect
        type="dns"
        v-model="node"
      />
    </h1>

    <div class="card-list">
      <Card
        title="QPS"
        v-model="qpsTime"
        :download="qpsLinks"
      >
        <line-bar
          :labels="qpsLabels"
          :values="qpsValues"
          series-name="qps"
        />
      </Card>

      <Card
        title="缓存命中率"
        v-model="cachehitTime"
        :download="cachehitLinks"
      >
        <line-bar
          is-percent
          :labels="memoHitRateLabels"
          :values="memoHitRateValues"
          series-name="缓存命中率"
        />
      </Card>

      <Card
        title="解析成功率"
        v-model="resolvedratiosTime"
        :download="resolvedratiosLinks"
      >
        <line-bar
          is-percent
          multiple
          :labels="successRateLabels"
          :values="successRateValues"
        />
      </Card>

      <Card
        title="解析类型"
        v-model="querytyperatiosTime"
        :download="querytyperatiosLinks"
      >
        <Pie :values="types" />
      </Card>

      <Card
        title="TOP请求域名"
        v-model="toptendomainsTime"
        :download="toptendomainsLinks"
      >
        <Table
          :data="domains"
          :columns="topDomainColumns"
          style="padding-top: 30px"
        />
      </Card>

      <Card
        title="TOP请求IP"
        v-model="toptenipsTime"
        :download="toptenipsLinks"
      >
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
          key: "domain",
          align: "center"
        },
        {
          title: "统计次数",
          key: "count",
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
          key: "ip",
          align: "center"
        },
        {
          title: "统计次数",
          key: "count",
          align: "center"
        }
      ],
      timer: null,

      qpsTime: 6,
      qpsLinks: {},
      qpsLabels: [],
      qpsValues: [],

      toptenipsTime: 6,
      toptenipsLinks: {},
      ips: [],

      toptendomainsTime: 6,
      toptendomainsLinks: {},
      domains: [],

      querytyperatiosTime: 6,
      querytyperatiosLinks: {},
      types: [],
      status: [],

      resolvedratiosTime: 6,
      resolvedratiosLinks: {},
      successRateLabels: [],
      successRateValues: [],

      cachehitTime: 6,
      cachehitLinks: {},
      memoHitRateLabels: [],
      memoHitRateValues: []
    };
  },
  computed: {},
  watch: {
    node() {
      this.initDataRequest();
    },
    qpsTime(from) {
      this.getQPSData({ from });
    },
    toptenipsTime(from) {
      this.getTopIps({ from });
    },
    toptendomainsTime(from) {
      this.getToptendomainsTimeData({ from });
    },
    querytyperatiosTime(from) {
      this.getQuerytyperatiosData({ from });

    },
    resolvedratiosTime(from) {
      this.getResolvedratiosData({ from });
    },
    cachehitTime(from) {
      this.getCachehitData({ from });
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
      this.getNodeInfo();
    },

    intercept() {
      const hasNode = !!this.node;
      return new Promise(resolve => {
        if (hasNode) {
          resolve();
        }
      });
    },


    baseGet(params) {
      return new Promise(resolve => {
        this.intercept().then(_ => {
          this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dnses`) }).then(data => {
            resolve(data);
          });

        }).catch(err => err);
      });
    },

    getNodeInfo() {
      this.baseGet().then(({ data }) => {

        console.log(data)
        data.forEach(item => {

          if (item.id === "toptenips") {
            this.ips = item.toptenips;
            this.toptenipsLinks = item.links;
          }

          if (item.id === "toptendomains") {
            this.domains = item.toptendomains;
            this.toptendomainsLinks = item.links;
          }

          if (item.id === "qps") {
            const [labels, values] = valuesParser(item.qps.values || []);
            this.qpsLabels = labels;
            this.qpsValues = values;
            this.qpsLinks = item.links;
          }

          if (item.id === "cachehit") {
            const [labels, values] = valuesParser(item.cachehit.values || []);
            this.memoHitRateLabels = labels;
            this.memoHitRateValues = values;
            this.cachehitLinks = item.links;
          }

          if (item.id === "querytyperatios") {
            this.querytyperatiosLinks = item.links;

            // TODO: 略显尴尬
            this.types = item.querytyperatios.map(item => {
              return {
                name: item.type,
                value: item.ratios[0].ratio || 0
              };
            });
          }

          if (item.id === "resolvedratios") {
            const [labels] = valuesParser(item.resolvedratios[0].ratios || []);
            this.successRateLabels = labels;
            this.successRateValues = item.resolvedratios;
            this.resolvedratiosLinks = item.links;
          }
        });
      });
    },

    getQPSData(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.qpsLinks.self }).then(({ qps: values }) => {
          console.log(values)
          const [labels, value] = valuesParser(values);
          this.qpsLabels = labels;
          this.qpsValues = value;
        }).catch(err => err);
      });
    },

    getCachehitData(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.cachehitLinks.self }).then(({ cachehit: values }) => {
          console.log(values)
          const [labels, value] = valuesParser(values);
          this.memoHitRateLabels = labels;
          this.memoHitRateValues = value;
        }).catch(err => err);
      });
    },

    getResolvedratiosData(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.resolvedratiosLinks.self }).then(({ resolvedratios }) => {
          console.log(resolvedratios)
          const [labels, value] = valuesParser(resolvedratios[0].ratios);
          this.memoHitRateLabels = labels;
          this.memoHitRateValues = resolvedratios;
        }).catch(err => err);
      });
    },

    getQuerytyperatiosData(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.querytyperatiosLinks.self }).then(({ querytyperatios }) => {
          console.log(querytyperatios)
          this.types = querytyperatios.map(item => {
            return {
              name: item.type,
              value: item.ratios[0].ratio || 0
            };
          });

        }).catch(err => err);
      });
    },

    getToptendomainsTimeData(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.toptendomainsLinks.self }).then(({ toptendomains }) => {
          console.log(toptendomains)
          this.domains = toptendomains;
        }).catch(err => err);
      });
    },

    getTopIps(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.toptenipsLinks.self }).then(({ toptenips }) => {
          this.ips = toptenips;
        }).catch(err => err);
      });
    }


  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>