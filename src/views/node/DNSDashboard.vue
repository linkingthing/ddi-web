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
          line-theme="color1"
          :labels="qpsLabels"
          :values="qpsValues"
          series-name="qps"
          :isTimeOut="qpsTimeOut"
        />
      </Card>

      <Card
        title="缓存命中率"
        v-model="cachehitTime"
        :download="cachehitLinks"
      >
        <line-bar
          is-percent
          line-theme="color2"
          :labels="memoHitRateLabels"
          :values="memoHitRateValues"
          series-name="缓存命中率"
          :isTimeOut="memoTimeOut"
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
          line-theme="color3"
          :labels="successRateLabels"
          :values="successRateValues"
          :isTimeOut="successTimeOut"
          showField="rcode"
          :showLines="['Success']"
        />
      </Card>

      <Card
        title="解析类型"
        v-model="querytyperatiosTime"
        :download="querytyperatiosLinks"
      >
        <Pie
          :values="types"
          :isTimeOut="querytypeTimeOut"
        />
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
          :isTimeOut="topDomainTimeOut"
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
          :isTimeOut="topIpTimeOut"
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
import eventBus from "@/util/bus";

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
          key: "count"
        },
        {
          title: "操作",
          key: "action",
          width: 60,
          render: (h, { row }) => {
            return h("btn-line", {
              style: {
                display: this.$hasPermission("domainportraits", "GET") ? "inline-block" : "none"
              },
              on: {
                click: () => this.handleSearchDomain(row.domain)
              },
              props: {
                title: "查询"
              }
            });
          }
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
          key: "count"
        },
        {
          title: "操作",
          key: "action",
          width: 60,
          render: (h, { row }) => {
            return h("btn-line", {
              style: {
                display: this.$hasPermission("ipportrait", "GET") ? "inline-block" : "none"
              },
              on: {
                click: () => this.handleSearchIp(row.ip)
              },
              props: {
                title: "查询"
              }
            });
          }
        }
      ],
      timer: null,

      qpsTime: "",
      qpsLinks: {},
      qpsLabels: [],
      qpsValues: [],
      qpsTimeOut: false,

      toptenipsTime: "",
      toptenipsLinks: {},
      ips: [],
      topIpTimeOut: false,

      toptendomainsTime: "",
      toptendomainsLinks: {},
      domains: [],
      topDomainTimeOut: false,

      querytyperatiosTime: "",
      querytyperatiosLinks: {},
      types: [],
      status: [],
      querytypeTimeOut: false,

      resolvedratiosTime: "",
      resolvedratiosLinks: {},
      successRateLabels: [],
      successRateValues: [],
      successTimeOut: false,

      cachehitTime: "",
      cachehitLinks: {},
      memoHitRateLabels: [],
      memoHitRateValues: [],
      memoTimeOut: false
    };
  },
  computed: {},
  watch: {
    node() {
      this.initDataRequest();
    },
    qpsTime: {
      deep: true,
      handler(date) {
        this.getQPSData({ from: date, to: date });
      }
    },
    toptenipsTime(date) {
      this.getTopIps({ from: date, to: date });
    },
    toptendomainsTime(date) {
      this.getToptendomainsTimeData({ from: date, to: date });
    },
    querytyperatiosTime(date) {
      this.getQuerytyperatiosData({ from: date, to: date });

    },
    resolvedratiosTime(date) {
      this.getResolvedratiosData({ from: date, to: date });
    },
    cachehitTime(date) {
      this.getCachehitData({ from: date, to: date });
    }

  },
  created() { },
  mounted() {
    this.initDataRequest();
    this.timer = setInterval(this.getAllInfo, 5 * 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {

    getAllInfo() {

      this.getQPSData({ from: this.qpsTime, to: this.qpsTime });
      this.getCachehitData({ from: this.cachehitTime, to: this.cachehitTime });
      this.getResolvedratiosData({ from: this.resolvedratiosTime, to: this.resolvedratiosTime });
      this.getQuerytyperatiosData({ from: this.querytyperatiosTime, to: this.querytyperatiosTime });
      this.getToptendomainsTimeData({ from: this.toptendomainsTime, to: this.toptendomainsTime });
      this.getTopIps({ from: this.toptenipsTime, to: this.toptenipsTime });
    },
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
            this.toptenipsLinks = item.links;
          }

          if (item.id === "toptendomains") {
            this.toptendomainsLinks = item.links;
          }

          if (item.id === "qps") {
            this.qpsLinks = item.links;
          }

          if (item.id === "cachehitratio") {

            this.cachehitLinks = item.links;
          }

          if (item.id === "querytyperatios") {
            this.querytyperatiosLinks = item.links;
          }

          if (item.id === "resolvedratios") {
            this.resolvedratiosLinks = item.links;
          }

        });
      }).then(this.getAllInfo);
    },

    getQPSData(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.qpsLinks.self }).then(({ qps: { values } }) => {
          const [labels, value] = valuesParser(values);
          this.qpsLabels = labels;
          this.qpsValues = value;
          this.qpsTimeOut = false;
        }).catch(() => {
          this.qpsTimeOut = true;
        });
      });
    },

    getCachehitData(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.cachehitLinks.self }).then(({ cachehitratio }) => {
          const [labels, value] = valuesParser(cachehitratio.ratios);
          this.memoHitRateLabels = labels;
          this.memoHitRateValues = value;
          this.memoTimeOut = false;
        }).catch(() => {
          this.memoTimeOut = true;
        });
      });
    },

    getResolvedratiosData(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.resolvedratiosLinks.self })
          .then(data => {
            this.successTimeOut = false;
            return data;
          }, () => {
            this.successTimeOut = true;
          })
          .then(({ resolvedratios }) => {
            const [labels, values] = valuesParser(resolvedratios.find(item => item.rcode === "Success").ratios);
            this.successRateLabels = labels;
            this.successRateValues = resolvedratios;
            this.successTimeOut = false;
          }).catch(err => {
            this.successRateValues = [];
          });
      });
    },

    getQuerytyperatiosData(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.querytyperatiosLinks.self }).then(({ querytyperatios }) => {
          this.types = Array.isArray(querytyperatios) ? querytyperatios.map(item => {
            return {
              name: item.type,
              value: item.ratios[item.ratios.length - 1].ratio || 0
            };
          }) : [];
          this.querytypeTimeOut = false;

        }).catch(err => {
          this.querytypeTimeOut = true;
        });
      });
    },

    getToptendomainsTimeData(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.toptendomainsLinks.self }).then(({ toptendomains }) => {
          this.domains = toptendomains;
          this.topDomainTimeOut = false;
        }).catch(() => {
          this.topDomainTimeOut = true;
        });
      });
    },

    getTopIps(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.toptenipsLinks.self }).then(({ toptenips }) => {
          this.ips = toptenips;
          this.topIpTimeOut = false;
        }).catch(err => {
          this.topIpTimeOut = true;
        });
      });
    },

    handleSearchDomain(domain) {
      eventBus.$emit("onSearchDomain", domain);
    },
    handleSearchIp(ip) {
      eventBus.$emit("onSearchIp", ip);

    }


  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>