<template>
  <div class="nodeManage">
    <!-- <Tabs @on-click="handleTab">
      <TabPane
        label="拓扑图"
        name="topology"
      > -->
    <div class="node-topology">
      <Row>
        <i-col :span="8">
          <article>
            <h1>节点拓扑图</h1>
            <p>点击节点即可查看节点的详细数据分析</p>
          </article>

          <section>
            <ul>
              <li>
                <em>{{serverList.length}}</em>
                <span>总节点数</span>
              </li>
              <li>
                <em>{{serverList.filter(item => item.state).length}}</em>
                <span>在线节点数</span>
              </li>
              <li>
                <em>{{serverList.filter(item => !item.state).length}}</em>
                <span>离线节点数</span>
              </li>
            </ul>
          </section>

        </i-col>
        <i-col
          :span="16"
          class="innerbox"
          style="text-align: right;overflow: auto;"
        >
          <div class="node-box">
            <div class="parent">
              <div
                class="host"
                @click="handleGoDeviceInfo(item)"
                v-for="item in serverList.filter(item => item.role === 'controller') "
                :key="item.ip"
              >
                <host-node :host="item" />
              </div>
            </div>
            <div class="children">
              <host-node
                :host="item"
                @click="handleGoDeviceInfo(item)"
                :key="item.ip"
                v-for="item in serverList.filter(item => item.role !== 'controller') "
              />
            </div>
          </div>
        </i-col>
      </Row>
    </div>

    <!-- </TabPane>
      <TabPane
        label="服务器列表"
        name="serverList"
      >
        <div class="tab-item">
          <Table
            :data="serverList"
            :columns="serviceColumns"
          />
        </div>
      </TabPane>
    </Tabs> -->

    <Row
      type="flex"
      justify="space-between"
      style="margin-bottom: 50px"
    >
      <i-col span="11">
        <Card title="QPS">
          <line-bar
            :labels="qpsLabels"
            :values="qpsValues"
          />
        </Card>

      </i-col>
      <i-col span="11">
        <Card title="解析成功率">
          <line-bar
            :labels="successRateLabels"
            :values="successRateValues"
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
        <Card title="DHCP使用率">
          <line-bar
            line-theme="brown"
            :labels="dhcpUsageLabels"
            :values="dhcpUsageValues"
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
        <Card title="Leases总量统计">
          <line-bar
            line-theme="golden"
            :labels="dhcpLeaseLabels"
            :values="dhcpLeaseValues"
          />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="DHCP报文统计">
          <line-bar
            :labels="dhcpLabels"
            :values="dhcpValues"
          />
        </Card>
      </i-col>
    </Row>

  </div>
</template>

<script>
import services from "@/services";
import Card from "./Card";
import Line from "./Line";
import Pie from "./Pie";
import HostNode from "./HostNode";
import moment from "moment";
moment.locale("zh-cn");

import { getDeviceHistoryInfo } from "./tools";


export default {
  components: {
    "host-node": HostNode,
    Card,
    "line-bar": Line,
    Pie
  },
  props: {},
  data() {
    return {
      serviceColumns: [
        {
          title: "服务器类型",
          key: "role",
          align: "center"
        },
        {
          title: "服务器名称",
          key: "hostname",
          align: "center"
        },
        {
          title: "服务器IP",
          key: "ip",
          align: "center"
        },
        {
          title: "服务器状态",
          key: "state",
          align: "center",
          render: (h, { row }) => {
            return h("div", [
              h("Badge", {
                props: {
                  status: row.state ? "success" : "error"
                }
              }),
              row.state ? "(在线)" : "(利线)"
            ]);
          }
        }
      ],
      serverList: [],
      node: "",
      qpsLabels: [],
      qpsValues: [],
      status: [],
      successRateLabels: [],
      successRateValues: [],
      dhcpLeaseLabels: [],
      dhcpLeaseValues: [],
      dhcpUsageLabels: [],
      dhcpUsageValues: [],
      dhcpLabels: [],
      dhcpValues: []
    };
  },
  watch: {
    node() {
      this.initDataRequest();
    }
  },

  mounted() {
    this.getList();
  },

  methods: {
    initDataRequest() {
      this.getQpsList();
      this.getDNSAnalysisStateData();
      this.getDNSAnalysisStateSuccessRecode();
      this.batchExecute();
    },
    getList() {
      services
        .getServerList()
        .then(res => {
          this.serverList = res.data.data || [];
          this.node = res.data.data.find(item => item.role === "controller").ip;
        })
        .catch(err => err);
    },
    getQpsList() {
      const params = {
        node: this.node || this.$route.query.ip,
        type: "qps"
      };
      getDeviceHistoryInfo(params)
        .then(([labels, values]) => {
          this.qpsLabels = labels || [];
          this.qpsValues = values || [];
        })
        .catch(err => err);
    },
    getDNSAnalysisStateData() {
      const params = {
        node: this.node || this.$route.query.ip,
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
    getDNSAnalysisStateSuccessRecode() {
      services
        .getDNSAnalysisState({
          node: this.node || this.$route.query.ip,
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
          this.successRateValues = data.map(item => item.successRate);
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
    batchExecute() {
      const node = this.node;
      const batch = [
        {
          type: "dhcppacket",
          labelsField: "dhcpLabels",
          valuesField: "dhcpValues"
        },
        {
          type: "dhcpusage",
          labelsField: "dhcpUsageLabels",
          valuesField: "dhcpUsageValues"
        },
        {
          type: "dhcplease",
          labelsField: "dhcpLeaseLabels",
          valuesField: "dhcpLeaseValues"
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
    },
    handleTab(tab) {
      console.log(tab);
    },
    handleGoDeviceInfo({ ip, role }) {
      if (role === "controller") {
        this.$router.push({
          name: "ControllerDashboard",
          query: { ip }
        });
      }

      if (role === "dns") {
        this.$router.push({
          name: "DNSDashboard",
          query: { ip }
        });
      }

      if (role === "dhcp") {
        this.$router.push({
          name: "DHCPDashboard",
          query: { ip }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@nodeLinkTop: -44px;
@nodeLinkHeight: 44px;

.nodeManage {
  padding: 30px;
}

.node-topology {
  height: 360px;
  padding: 50px 40px 20px;
  background-image: url("../../assets/images/bg-node-topology.png");

  article {
    margin-bottom: 120px;
  }
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  p {
    font-size: 14px;
    color: #999;
  }

  section {
    ul {
      display: flex;
    }
    li {
      width: 180px;
    }
    em {
      display: block;
      font-size: 30px;
      font-style: normal;
      font-weight: bold;
      margin-bottom: 4px;
    }
    span {
      font-size: 14px;
      color: #999;
    }
  }
}

.innerbox::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.innerbox::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
.innerbox::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.node-box {
  display: inline-block;
  height: 280px;
}

.parent {
  display: flex;
  justify-content: center;
  .host {
    margin-left: 30px;
  }
}

.children {
  display: flex;
  text-align: center;
  margin-top: 70px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    margin-left: -40px;
    top: -80px;
    height: @nodeLinkHeight;
    width: 2px;
    border-left: 2px solid #afcbf9;
  }

  .host {
    position: relative;
    display: inline-block;
    text-align: left;
    margin: 0 20px;
    width: 160px;

    &::before {
      content: "";
      position: absolute;
      left: 50%;
      margin-left: -40px;
      top: @nodeLinkTop;
      height: @nodeLinkHeight;
      width: 0;
      border-left: 2px solid #afcbf9;
    }
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      margin-left: -40px;
      top: @nodeLinkTop;
      width: 200px;
      border-top: 2px solid #afcbf9;
    }
    &:last-child::after {
      border: 0;
    }
  }
}
.tab-item {
  padding-top: 60px;
}
</style>