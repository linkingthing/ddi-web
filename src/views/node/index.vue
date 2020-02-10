<template>
  <div class="node-manager" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">节点管理</div>

    <div class="middle">
      <Row>
        <i-col span="6">
          <Tree :data="nodeList" @on-select-change="handleSelectNode" multiple class="tree"></Tree>
        </i-col>
        <i-col span="18">
          <div class="qps">
            <span class="qps-title">QPS</span>
            <span class="count">{{ qps }}</span>
            <span>个/秒</span>
          </div>
          <Row>
            <i-col span="8" v-for="dash in dashboardList" :key="dash.type">
              <div>
                <my-chart :values="dash"></my-chart>
              </div>
            </i-col>
          </Row>

          <div class="line-graph">
            <div class="filter-wrapper">
              <div class="tab-device">
                <Tabs active-key="lineParams.type" @on-click="handleChangeType">
                  <Tab-pane
                    :name="dash.type"
                    :label="dash.name"
                    v-for="dash in dashboardList"
                    :key="dash.type"
                  ></Tab-pane>
                </Tabs>
              </div>
              <div class="date-pick-content">
                <date-picker @onSearch="handleSearch"></date-picker>
              </div>
            </div>

            <line-bar :values="usageData" :labels="dateData"></line-bar>
            <Spin size="large" fix v-if="spinShow"></Spin>
          </div>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import services from "@/services";
import myChart from "./dashboard";
import line from "./line";
import datePicker from "@/components/datePicker";
import { dateFormat } from "@/util/common";

export default {
  name: "node-manage",
  components: {
    "my-chart": myChart,
    "line-bar": line,
    "date-picker": datePicker
  },
  data() {
    return {
      query: {
        node: "" // ip
      },
      qps: "",
      dashboardList: [
        {
          name: "CPU利用率",
          value: "0",
          type: "cpu"
        },
        {
          name: "内存利用率",
          value: "0",
          type: "mem"
        },
        {
          name: "磁盘利用率",
          value: "0",
          type: "disk"
        }
      ],
      nodeList: [],

      // 折线图请求参数
      lineParams: {
        node: "",
        type: "cpu",
        start: "",
        end: "",
        step: ""
      },
      usageData: [],
      dateData: [],
      spinShow: false
    };
  },
  mounted() {
    this.getInitNodeData();
  },
  methods: {
    /**
     * think: 获取到的而对象是map结构，解析出的结果的顺序可能偏离预设顺序
     */
    getInitNodeData() {
      services.getNodeList(this.query).then(res => {
        this.baseData = [];
        if (res.data.status === "success") {
          const { nodes, usage } = res.data.data;
          this.nodeList = [this.analysisNodeListAndGroup(nodes)];
          const [[node, usageObj]] = Object.entries(usage); // 取第一条作为当前node/ip 和 右边饼图展示信息
          this.query.node = node;
          this.lineParams.node = node; // 初始化
          this.dashboardList = this.dashboardList.map(dash => {
            return {
              ...dash,
              value: usageObj[dash.type]
            };
          });
          this.qps = usageObj.qps;
        }
      });
    },

    /**
     * analysisNodeListAndGroup
     * 数据解析函数, 将返回节点map转换成树形结构数据
     * "role": 0, //节点的类型，0是控制器，1是数据库，2是消息队列 分组
     */
    analysisNodeListAndGroup(data) {
      const self = this;
      const controller = {
        expand: true,
        role: 0,
        type: "controller",
        title: "控制器",
        children: []
      };
      const db = {
        expand: true,
        role: 1,
        type: "db",
        title: "数据库",
        children: []
      };
      const queue = {
        expand: true,
        role: 2,
        type: "queue",
        title: "消息队列",
        children: []
      };

      Object.values(data).forEach((item, index, arr) => {
        const obj = {
          ...item,
          title: item.hostname,
          // value: item.ip
          render: (h, { root, node, data }) => {
            return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    self.handleSelectNode(node, { ...data, value: item.ip });
                  }
                }
              },
              [
                h(
                  "span",
                  {
                    style: {
                      paddingRight: "10px"
                    }
                  },
                  data.ip
                ),
                h("Badge", {
                  props: {
                    status: data.state ? "success" : "error"
                  }
                })
              ]
            );
          }
        };
        if (item.role === 0) {
          controller.children.push(obj);
        }
        if (item.role === 1) {
          db.children.push(obj);
        }
        if (item.role === 2) {
          queue.children.push(obj);
        }
      });
      return {
        expand: true,
        type: "node",
        title: "节点管理",
        children: [controller, db, queue]
      };
    },
    handleSelectNode(_, { value }) {
      if (value) {
        this.query.node = value;
        this.getInitNodeData();
      }
    },
    getDeviceHistoryInfo(params) {
      this.spinShow = true;
      services.getDeviceHistoryInfo(params).then(res => {
        if (res.data.status === "success") {
          // optimize：一行代码解决
          this.dateData = res.data.data.values.map(item =>
            dateFormat(item[0], "yyyy-MM-dd")
          );
          this.usageData = res.data.data.values.map(item => item[1]);
        }
        this.spinShow = false;
      });
    },
    handleChangeType(type) {
      this.lineParams.type = type;
    },
    handleSearch(options) {
      this.lineParams = {
        ...this.lineParams,
        ...options
      };
    }
  },
  watch: {
    lineParams: {
      handler(values) {
        this.getDeviceHistoryInfo(values);
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="less">
.node-manager {
  padding: 0px;
  background-color: white;
  border-radius: 6px;
  .header-title {
    font-size: 16px;
    height: 72px;
    line-height: 72px;
    padding-left: 30px;
    padding-right: 30px;
    font-size: 16px;
  }
}

.tree {
  border-right: 1px solid #ddd;
  min-height: 360px;
  margin: 0 50px;
}
.qps {
  font-size: 18px;
  color: #333;
  .qps-title {
    display: inline-block;
    border-left: 6px solid #4796ff;
    padding-left: 20px;
  }
  .count {
    font-weight: bold;
  }
  span {
    font-size: 16px;
    color: #666;
  }
}

.view {
  position: relative;
  font-size: 16px;
  color: #666;
  text-align: center;
  z-index: 100;
  margin-top: -70px;
}

.view:hover {
  cursor: pointer;
  color: #4796ff;
}

.line-graph {
  position: relative;
  padding: 30px;
}
.filter-wrapper {
  display: flex;

  .date-pick-content {
    flex: 1;
    position: relative;
    z-index: 200;
    text-align: right;
  }
}
</style>