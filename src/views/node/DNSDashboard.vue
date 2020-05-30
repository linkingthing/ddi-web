<template>
  <div class="DNSDashboard dashboard">
    <h1 class="d-title">DNS服务器</h1>

    <Row
      type="flex"
      justify="space-between"
      style="margin-bottom: 50px"
    >
      <i-col span="11">
        <HostInfo :ip="ip" />
      </i-col>
      <i-col span="11">
        <Card title="QPS">
          <line-bar
            :labels="qpsLabels"
            :values="qpsValues"
          />
        </Card>
      </i-col>
    </Row>

    <Row
      type="flex"
      justify="space-between"
      style="margin-bottom: 50px"
    >
      <i-col span="11">
        <Card title="解析状态">
          <Pie :values="status" />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="解析类型">
          <Pie :values="types" />
        </Card>
      </i-col>
    </Row>
    <Row
      type="flex"
      justify="space-between"
      style="margin-bottom: 50px"
    >
      <i-col span="11">
        <Card title="解析成功率">
          <line-bar
            is-percent
            :labels="successRateLabels"
            :values="successRateValues"
          />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="缓存命中率">
          <line-bar
            is-percent
            :labels="memoHitRateLabels"
            :values="memoHitRateValues"
          />
        </Card>
      </i-col>
    </Row>
    <Row
      type="flex"
      justify="space-between"
      style="margin-bottom: 50px"
    >
      <i-col span="11">
        <Card title="TOP请求域名">
          <Table
            :data="domains"
            :columns="topDomainColumns"
            style="padding-top: 30px"
          />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="TOP请求IP">
          <Table
            :data="ips"
            :columns="topIPColumns"
            style="padding-top: 30px"
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
import Pie from "./Pie";
import services from "@/services";
import moment from "moment";
moment.locale("zh-cn");
import { getDeviceHistoryInfo } from "./tools";

export default {
  name: "DNSDashboard",
  components: { Card, HostInfo, "line-bar": Line, Pie },
  props: {
    ip: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
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
    ip() {
      this.initDataRequest();
    }
  },
  created() { },
  mounted() {
    // this.initDataRequest();
    // this.timer = setInterval(() => {
    //   this.initDataRequest();
    // }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    initDataRequest() {
      const node = this.ip || this.$route.query.ip;
      this.getDNSTop(node);
      this.getQpsList(node);
      this.getDNSAnalysisStateData(node);
      this.getDNSAnalysisStateSuccessRecode(node);
      this.getMemoHitRateData(node);
    },
    getQpsList(node) {
      const params = {
        node,
        type: "qps"
      };
      getDeviceHistoryInfo(params)
        .then(([labels, values]) => {
          this.qpsLabels = labels || [];
          this.qpsValues = values || [];
        })
        .catch(err => err);
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
    getDNSAnalysisStateSuccessRecode(node) {
      services
        .getDNSAnalysisState({
          node,
          start: parseInt(new Date().getTime() / 1000 - 5 * 24 * 60 * 60),
          end: parseInt(new Date().getTime() / 1000)
        })
        .then(res => {
          const result = this.analysisMatrix(res.data.data.result);
          const data = Object.values(result).map(timeGroup => {
            let successCount = 0;
            let time;
            const total = timeGroup
              .map(item => {
                if (item.type === "NOERROR") {
                  successCount = item.count;
                  time = item.time;
                }
                return item.count;
              })
              .reduce((result, current) => {
                return result + current;
              }, 0);
            const successRate = successCount / total || 0;
            return {
              total,
              time,
              successCount,
              successRate
            };
          });

          this.successRateLabels = data.map(item => item.time);
          this.successRateValues = data.map(item => item.successRate.toFixed(4));
        })
        .catch(err => err);
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
    getMemoHitRateData(node) {
      const params = {
        node,
        start: moment().unix() - 5 * 24 * 60 * 60,
        end: moment().unix()
      };
      services
        .getMemoHitRate(params)
        .then(res => {
          const result = this.analysisMatrix(res.data.data.result);
          const data = this.executeRate(result);
          this.memoHitRateLabels = data.map(item => item.time);
          this.memoHitRateValues = data.map(item => item.rate);
        })
        .catch(err => err);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>