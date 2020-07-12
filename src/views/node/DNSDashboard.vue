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
          :labels="successRateLabels"
          :values="successRateValues"
          series-name="解析成功率"
        />
        <!-- multiple -->
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
        <TopList
          :data="domains"
          :columns="topDomainColumns"
          style="padding-top: 20px"
        />
      </Card>

      <Card
        title="TOP请求IP"
        v-model="toptenipsTime"
        :download="toptenipsLinks"
      >
        <TopList
          :data="ips"
          :columns="topIPColumns"
          style="padding-top: 20px"
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
import TopList from "./modules/top-list";

export default {
  name: "DNSDashboard",
  components: {
    Card,
    "line-bar": Line,
    Pie,
    NodeSelect,
    TopList
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
          width: 40
        },
        {
          title: "域名",
          key: "domain"
        },
        {
          title: "统计次数",
          key: "count",
          align: "right"
        }
      ],
      topIPColumns: [
        {
          title: "排名",
          type: "index",
          width: 40
        },
        {
          title: "IP地址",
          key: "ip"
        },
        {
          title: "统计次数",
          key: "count",
          align: "right"
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
    qpsTime(period) {
      this.getQPSData({ period });
    },
    toptenipsTime(period) {
      this.getTopIps({ period });
    },
    toptendomainsTime(period) {
      this.getToptendomainsTimeData({ period });
    },
    querytyperatiosTime(period) {
      this.getQuerytyperatiosData({ period });

    },
    resolvedratiosTime(period) {
      this.getResolvedratiosData({ period });
    },
    cachehitTime(period) {
      this.getCachehitData({ period });
    }

  },
  created() { },
  mounted() {
    this.initDataRequest();
    this.timer = setInterval(() => {
      this.getQPSData();
      this.getCachehitData();
      this.getResolvedratiosData();
      this.getQuerytyperatiosData();
      this.getToptendomainsTimeData();
      this.getTopIps();
    }, 3000);
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

          if (item.id === "cachehitratio") {
            // todo, 可能会改
            const [labels, values] = valuesParser(item.cachehitratio.ratios || []);
            this.memoHitRateLabels = labels;
            this.memoHitRateValues = values;
            this.cachehitLinks = item.links;
          }

          if (item.id === "querytyperatios") {
            this.querytyperatiosLinks = item.links;

            // TODO: 略显尴尬
            if (Array.isArray(item.querytyperatios)) {
              this.types = item.querytyperatios.map(item => {
                return {
                  name: item.type,
                  value: ({ ...item.ratios.pop() }).ratio || 0
                };
              });
            } else {
              this.types = [];
            }

          }

          if (item.id === "resolvedratios") {
            if (Array.isArray(item.resolvedratios)) {
              const [labels, values] = valuesParser(item.resolvedratios.find(item => item.rcode === "Success").ratios || []);
              this.successRateLabels = labels;
              this.successRateValues = values;
              this.resolvedratiosLinks = item.links;
            } else {
              this.successRateLabels = [];
              this.successRateValues = [];
              this.resolvedratiosLinks = item.links;
            }

          }
        });
      });
    },

    getQPSData(params = { period: this.qpsTime }) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.qpsLinks.self }).then(({ qps: { values } }) => {
          const [labels, value] = valuesParser(values);
          this.qpsLabels = labels;
          this.qpsValues = value;
        }).catch(err => err);
      });
    },

    getCachehitData(params = { period: this.cachehitTime }) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.cachehitLinks.self }).then(({ cachehitratio }) => {
          const [labels, value] = valuesParser(cachehitratio.ratios);
          this.memoHitRateLabels = labels;
          this.memoHitRateValues = value;
        }).catch(err => err);
      });
    },

    getResolvedratiosData(params = { period: this.resolvedratiosTime }) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.resolvedratiosLinks.self }).then(({ resolvedratios }) => {
          const [labels, values] = valuesParser(resolvedratios.find(item => item.rcode === "Success").ratios);
          this.successRateLabels = labels;
          this.successRateValues = values;
        }).catch(err => err);
      });
    },

    getQuerytyperatiosData(params = { period: this.querytyperatiosTime }) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.querytyperatiosLinks.self }).then(({ querytyperatios }) => {
          this.types = querytyperatios.map(item => {
            return {
              name: item.type,
              value: item.ratios[item.ratios.length - 1].ratio || 0
            };
          });

        }).catch(err => err);
      });
    },

    getToptendomainsTimeData(params = { period: this.toptendomainsTime }) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.toptendomainsLinks.self }).then(({ toptendomains }) => {
          this.domains = toptendomains;
        }).catch(err => err);
      });
    },

    getTopIps(params = { period: this.toptenipsTime }) {
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