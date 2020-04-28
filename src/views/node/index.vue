<template>
  <div class="nodeManage">
    <!-- <Tabs @on-click="handleTab">
      <TabPane
        label="拓扑图"
        name="topology"
      >
        <div style="zoom: 0.6">
          <div class="parent tab-item">
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
      </TabPane>
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
    >
      <i-col span="11">
        <Card title="解析成功率">
          <line-bar
            :labels="successRateLabels"
            :values="successRateValues"
          />
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
import HostNode from "./HostNode";
import Card from "./Card";
import Line from "./Line";

export default {
  components: {
    "host-node": HostNode,
    Card,
    "line-bar": Line
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
      qpsLabels: [],
      qpsValues: [],
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

  mounted() {
    this.getList();
  },

  methods: {
    getList() {
      services
        .getServerList()
        .then(res => {
          this.serverList = res.data.data;
        })
        .catch(err => err);
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
      console.log(role);
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
.nodeManage {
  padding: 30px;
}
.parent {
  display: flex;
  justify-content: center;
  .host {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      margin-left: -110px;
      bottom: -60px;
      height: 80px;
      width: 2px;
      border-left: 2px dotted #006fe4;
    }
  }
}

.children {
  text-align: center;
  margin-top: 140px;

  .host {
    position: relative;
    display: inline-block;
    text-align: left;
    margin: 0 20px;
    width: 300px;

    &::before {
      content: "";
      position: absolute;
      left: 50%;
      margin-left: -110px;
      top: -80px;
      height: 80px;
      width: 0;
      border-left: 2px dotted #006fe4;
    }
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      margin-left: -110px;
      top: -80px;
      width: 340px;
      border-top: 2px dotted #006fe4;
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