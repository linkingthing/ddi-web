<template>
  <div class="DHCPDashboard dashboard">
    <h1 class="d-title">DHCP服务器
      <NodeSelect
        type="dhcp"
        v-model="node"
      />
    </h1>
    <div class="card-list">

      <Card
        title="DHCP使用率"
        v-model="usageTime"
        :download="$getApiByRoute(`/monitor/metric/nodes/${this.node}/dhcps/${this.node}/lpses?action=exportcsv`)"
      >
        <template v-slot:right>
          <Select
            style="width: 100px;"
            v-model="useageIpnet"
          >
            <Option
              :value="item.ipnet"
              v-for="item in usageList"
              :key="item.ipnet"
            >{{item.ipnet}}</Option>
          </Select>
        </template>

        <line-bar
          is-percent
          line-theme="brown"
          :labels="dhcpUsageLabels"
          :values="dhcpUsageValues"
        />
      </Card>

      <Card
        title="LPS统计"
        v-model="lpsTime"
      >
        <line-bar
          :labels="dhcpLpsLabels"
          :values="dhcpLpsValues"
          series-name="LPS统计"
        />
      </Card>

      <Card
        title="DHCP报文统计"
        v-model="dhcpTime"
      >
        <line-bar
          multiple
          :labels="dhcpLabels"
          :values="dhcpValues"
        />
      </Card>

      <Card
        title="Leases总量统计"
        v-model="leaseTime"
      >
        <line-bar
          line-theme="golden"
          :labels="dhcpLeaseLabels"
          :values="dhcpLeaseValues"
          series-name="Leases总量"
        />
      </Card>
    </div>

  </div>
</template>

<script>
import Card from "./Card";
import Line from "./Line";
import NodeSelect from "./modules/node-select";
import { valuesParser } from "./tools";

export default {
  name: "DHCPDashboard",
  components: { Card, "line-bar": Line, NodeSelect },
  props: {
    ip: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      node: "",

      lpsTime: 6,
      dhcpLpsLabels: [],
      dhcpLpsValues: [],

      dhcpTime: 6,
      dhcpLabels: [],
      dhcpValues: [],

      usageTime: 6,
      dhcpUsageLabels: [],
      dhcpUsageValues: [],

      dhcpLeaseLabels: [],
      dhcpLeaseValues: [],

      timer: null,
      assignList: [],

      leaseTime: 6,

      usageList: [],
      useageIpnet: ""
    };
  },
  watch: {
    node() {
      this.init();
    },

    usageTime(from) {
      this.getSubnetUsedRatioList({ from });
    },

    dhcpTime(from) {
      this.getPacketList({ from });
    },

    leaseTime(from) {
      this.getLeaseList({ from });
    },

    lpsTime(from) {
      this.getLpsList({ from });
    },

    useageIpnet(ipnet) {
      const [{ usedRatios }] = this.usageList.filter(item => item.ipnet === ipnet);
      const [labels, value] = valuesParser(usedRatios);
      this.dhcpUsageLabels = labels;
      this.dhcpUsageValues = value;
    }

  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getLeaseList();
      this.getLpsList();
      this.getPacketList();
      this.getSubnetUsedRatioList();
    },

    intercept() {
      const hasNode = !!this.node;
      return new Promise(resolve => {
        if (hasNode) {
          resolve();
        }
      });
    },

    getSubnetUsedRatioList(params) {
      this.intercept().then(_ => {
        this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dhcps/${this.node}/subnetusedratios`) }).then(({ data }) => {
          this.usageList = data.map(({ ipnet, usedRatios }) => {
            return {
              ipnet,
              usedRatios
            };
          });
          if (this.usageList.length) {
            this.useageIpnet = this.usageList[0].ipnet;
          }
        });
      }).catch(err => err);
    },

    getLpsList(params) {
      this.intercept().then(_ => {
        this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dhcps/${this.node}/lpses`) }).then(({ data: [{ values }] }) => {
          const [labels, value] = valuesParser(values);
          this.dhcpLpsLabels = labels;
          this.dhcpLpsValues = value;
        }).catch(err => err);
      });
    },

    getLeaseList(params) {
      this.intercept().then(_ => {
        this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dhcps/${this.node}/leases`) }).then(({ data: [{ values }] }) => {
          const [labels, value] = valuesParser(values);
          this.dhcpLeaseLabels = labels;
          this.dhcpLeaseValues = value;
        }).catch(err => err);
      });
    },

    getPacketList(params) {
      this.intercept().then(_ => {
        this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dhcps/${this.node}/packets`) }).then(({ data }) => {
          const [{ values }] = data;
          const [labels] = valuesParser(values);
          this.dhcpLabels = labels;

          this.dhcpValues = data;

        }).catch(err => err);
      });
    }

  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");

.d-title {
  display: flex;
  align-items: center;
}
</style>