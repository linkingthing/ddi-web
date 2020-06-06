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
          series-name="qps"
        />
      </Card>

      <Card title="缓存命中率">
        <line-bar
          is-percent
          :labels="memoHitRateLabels"
          :values="memoHitRateValues"
          series-name="缓存命中率"
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


    baseGet(params, labelField, valueField) {
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
          }

          if (item.id === "toptendomains") {
            this.domains = item.toptendomains;
          }

          if (item.id === "qps") {
            const [labels, values] = valuesParser(item.qps.values || []);
            this.qpsLabels = labels;
            this.qpsValues = values;
          }

          if (item.id === "cachehit") {
            const [labels, values] = valuesParser(item.cachehit.values || []);
            this.memoHitRateLabels = labels;
            this.memoHitRateValues = values;

          }

          if (item.id === "querytyperatios") {
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
          }


        });
      });
    }




  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>