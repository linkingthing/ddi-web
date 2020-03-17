<template>
  <div class="DHCPDashboard dashboard">
    <h1 class="d-title">DHCP服务器</h1>

    <Row type="flex" justify="space-between" style="margin-bottom: 50px">
      <i-col span="11">
        <HostInfo />
      </i-col>
      <i-col span="11">
        <Card title="DHCP报文统计">
          <line-bar :labels="dhcpLabels" :values="dhcpValues"></line-bar>
        </Card>
      </i-col>
    </Row>
    <Row type="flex" style="margin-bottom: 50px">
      <i-col span="24">
        <Card title="IP地址分配状态">
          <Table :data="assignList" :columns="ipColumns" style="padding-top: 30px" />
        </Card>
      </i-col>
    </Row>
    <Row type="flex" justify="space-between">
      <i-col span="11">
        <Card title="DHCP使用率">
          <line-bar lineTheme="brown" :labels="dhcpUsageLabels" :values="dhcpUsageValues"></line-bar>
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="Leases总量统计">
          <line-bar lineTheme="golden" :labels="dhcpLeaseLabels" :values="dhcpLeaseValues"></line-bar>
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
import { getDeviceHistoryInfo } from "./tools.js";
import services from "../../services";

export default {
  name: "DHCPDashboard",
  components: { Card, HostInfo, "line-bar": Line, Pie },
  props: {},
  data() {
    return {
      ipColumns: [
        {
          title: "子网名称",
          key: "name",
          align: "center"
        },
        {
          title: "网络地址",
          key: "addr",
          align: "center"
        },
        {
          title: "地址总量",
          key: "total",
          align: "center"
        },
        {
          title: "已分配数量",
          key: "used",
          align: "center"
        },
        {
          title: "剩余数量",
          key: "",
          align: "center"
        },
        {
          title: "IP地址使用率",
          key: "",
          align: "center"
        }
      ],

      dhcpLabels: [],
      dhcpValues: [],

      dhcpUsageLabels: [],
      dhcpUsageValues: [],

      dhcpLeaseLabels: [],
      dhcpLeaseValues: [],

      timer: null,
      assignList: []
    };
  },
  mounted() {
    this.init();
    this.getDHCPAssignData()
  },
  methods: {
    init() {
      this.batchExecute();
    },
    batchExecute() {
      const node = this.$route.query.ip;
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
          this[labelsField] = labels;
          this[valuesField] = values;
        });
      });
    },
    getDHCPAssignData() {
      services
        .getDHCPAssign()
        .then(res => {
          console.log(res.data)
          this.assignList = res.data
        })
        .catch(err => err);
    }
  }
};
</script>

<style lang="less" scoped>
.dashboard {
  padding: 30px;
}
.d-title {
  font-size: 22px;
  color: #252422;
  margin-bottom: 50px;
}
</style>