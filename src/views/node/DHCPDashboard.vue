<template>
  <div class="DHCPDashboard dashboard">
    <h1 class="d-title">DHCP服务器</h1>

    <Row
      type="flex"
      justify="space-between"
      style="margin-bottom: 50px"
    >
      <i-col span="11">
        <HostInfo :ip="ip" />
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

    <Row
      type="flex"
      justify="space-between"
      style="margin-bottom: 50px"
    >
      <i-col span="11">
        <Card title="DHCP使用率">
          <line-bar
            is-percent
            line-theme="brown"
            :labels="dhcpUsageLabels"
            :values="dhcpUsageValues"
          />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="Leases总量统计">
          <line-bar
            line-theme="golden"
            :labels="dhcpLeaseLabels"
            :values="dhcpLeaseValues"
          />
        </Card>
      </i-col>
    </Row>
    <Row
      type="flex"
      style="margin-bottom: 50px"
    >
      <i-col span="24">
        <Card title="IP地址分配状态">
          <Table
            :data="assignList"
            :columns="ipColumns"
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
import { getDeviceHistoryInfo } from "./tools.js";
import services from "../../services";

export default {
  name: "DHCPDashboard",
  components: { Card, HostInfo, "line-bar": Line },
  props: {
    ip: {
      type: String,
      default: ""
    }
  },
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
  watch: {
    ip() {
      this.init();
      this.getDHCPAssignData();
    }
  },
  mounted() {
    this.init();
    this.getDHCPAssignData();
  },
  methods: {
    init() {
      this.batchExecute();
    },
    batchExecute() {
      const node = this.ip || this.$route.query.ip;
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

          if (valuesField === "dhcpUsageValues") {
            this.dhcpUsageValues = this.dhcpUsageValues.map(item => Number(item / 100).toFixed(4));
          }
        });
      });

    },
    getDHCPAssignData() {
      services
        .getDHCPAssign()
        .then(res => {
          console.log(res.data.data)
          this.assignList = res.data.data;
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