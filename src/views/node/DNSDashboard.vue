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
import HostInfo from "./HostInfo";
import Line from "./Line";
import Pie from "./Pie";
import services from "@/services";
import moment from "moment";
moment.locale("zh-cn");
import { getDeviceHistoryInfo, valuesParser } from "./tools";
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
      // this.getDNSTop();
      this.getQpsList();
      // this.getDNSAnalysisStateData();
      this.getDNSAnalysisStateSuccessRecode();
      this.getMemoHitRateData();
    },

    intercept(resource, labels, value) { // TODO: 这钟封装
      const hasNode = !!this.node;
      return new Promise(resolve => {
        if (hasNode) {
          resolve();
        }
      });
    },

    baseGet(resource, params, labelField, valueField) {
      this.intercept().then(_ => {
        this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dnses/${this.node}/${resource}`) }).then(({ data: [{ values }] }) => {
          const [labels, value] = valuesParser(values);
          this[labelField] = labels;
          this[valueField] = value;
        });
      });
    },

    getQpsList(params) {
      this.baseGet("qpses", params, "dhcpLpsLabels", "dhcpLpsValues");
    },
    getDNSTop() {
      services
        .getDNSTop()
        .then(res => {
          const { ips, domains, types } = res.data.data;
          this.ips = ips;
          this.domains = domains;
          this.types = types.map(item => ({
            name: item.key,
            value: item.doc_count
          }));
        })
        .catch(err => err);
    },
    getDNSAnalysisStateData(node) {
      const params = {
        node,
        start: parseInt(new Date().getTime() / 1000)
      };
      services
        .getDNSAnalysisState(params)
        .then(res => {
          this.status = res.data.data.result.map(({ metric, values }) => {
            const [[, value]] = values;
            return {
              name: metric.data_type,
              value: Number(value)
            };
          });
        })
        .catch(err => err);
    },
    getDNSAnalysisStateSuccessRecode(params) {
      this.baseGet("resolvedratios", params, "successRateLabels", "successRateValues");
    },

    /**
     * 本质是数组平整化后重新分组的过程
     * data_type 维度转换成时间维度
     */
    analysisMatrix(matrix) {
      // x4
      const result = matrix
        .map(({ metric, values }) => {
          const { data_type } = metric;
          return values.map(([time, count]) => {
            return {
              time: moment(time * 1000).format("YYYY-MM-DD hh:mm:ss"),
              timestamp: time,
              count: +count,
              type: data_type
            };
          });
        })

        .reduce((all, current) => {
          return [...all, ...current];
        }, [])
        .reduce((result, current) => {
          if (Array.isArray(result[current.timestamp])) {
            result[current.timestamp].push(current);
          } else {
            result[current.timestamp] = [current];
          }
          return result;
        }, {});

      return result;
    },
    executeRate(stageData) {
      return Object.values(stageData).map(timeGroup => {
        let count = 0;
        let time;
        let total;
        timeGroup.forEach(item => {
          if (item.type === "memhit") {
            count = item.count;
          }
          if (item.type === "querys") {
            total = item.count;
            time = item.time;
          }
        });
        const rate = count / total || 0;
        return {
          time,
          count,
          total,
          rate
        };
      });
    },
    getMemoHitRateData(params) {
      this.intercept().then(_ => {
        this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dnses/${this.node}/cachehits`) }).then(({ data: [{ values }] }) => {
          const [labels, value] = valuesParser(values);
          this.memoHitRateLabels = labels;
          this.memoHitRateValues = value;
        });
      });

    }
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>