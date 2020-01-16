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
            <span class="count">{{qps}}</span>
            <span>个/秒</span>
          </div>
          <Row>
            <i-col span="8" v-for="dash in dashboardList" :key="dash.name">
              <div>
                <my-chart :values="dash" @click="hanldeClick"></my-chart>
                <div class="view">查看</div>
              </div>
            </i-col>
          </Row>
          <line-bar></line-bar>
        </i-col>
      </Row>
    </div>
  </div>
</template>

<script>
import services from "@/services";
import myChart from "./dashboard";
import line from "./line";

export default {
  name: "node-manage",
  components: {
    "my-chart": myChart,
    "line-bar": line
  },
  data() {
    return {
      query: {
        node: ""
      },
      qps: "",
      dashboardList: [
        {
          centerName: "CPU利用率",
          value: "0",
          name: "cpu"
        },
        {
          centerName: "内存利用率",
          value: "0",
          name: "mem"
        },
        {
          centerName: "磁盘利用率",
          value: "0",
          name: "disk"
        }
      ],
      nodeList: []
    };
  },
  mounted() {
    this.getInitNodeData();
  },
  methods: {
    getInitNodeData() {
      services.getNodeList(this.query).then(res => {
        this.baseData = [];
        if (res.data.status === "success") {
          const { nodes, usage } = res.data.data;
          this.nodeList = [this.analysisNodeListAndGroup(nodes)];
          const usageObj = Object.values(usage)[0];
          this.dashboardList = this.dashboardList.map(dash => {
            return {
              ...dash,
              value: usageObj[dash.name]
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
          value: item.ip
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
    hanldeClick(value) {
      console.log(value);
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
</style>