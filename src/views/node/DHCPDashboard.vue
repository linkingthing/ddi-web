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
        :download="useageLinks"
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
        :download="lpsLinks"
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
        :download="packetsLinks"
      >
        <template v-slot:right>
          <Select
            style="width: 100px;"
            v-model="packetsVersion"
          >
            <Option value="4">dhcp4</Option>
            <Option value="6">dhcp6</Option>
          </Select>
        </template>
        <line-bar
          v-if="showPacketsLine"
          multiple
          :labels="dhcpLabels"
          :values="dhcpValues"
        />
      </Card>

      <Card
        title="Leases总量统计"
        v-model="leaseTime"
        :download="leaseLinks"
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
      lpsLinks: {},
      dhcpLpsLabels: [],
      dhcpLpsValues: [],

      dhcpTime: 6,
      packetsLinks: {},
      dhcpLabels: [],
      dhcpValues: [],
      packetsVersion: "",
      packetsList: [],
      showPacketsLine: false,


      usageTime: 6,
      useageLinks: {},
      dhcpUsageLabels: [],
      dhcpUsageValues: [],

      leaseTime: 6,
      leaseLinks: {},
      dhcpLeaseLabels: [],
      dhcpLeaseValues: [],

      timer: null,
      assignList: [],


      usageList: [],
      useageIpnet: ""

    };
  },
  watch: {
    node() {
      this.init();
    },

    usageTime(period) {
      this.getSubnetUsedRatioList({ period });
    },

    dhcpTime(period) {
      this.getPacketList({ period });
    },

    leaseTime(period) {
      this.getLeaseList({ period });
    },

    lpsTime(period) {
      this.getLpsList({ period });
    },

    useageIpnet(ipnet) {
      const current = this.usageList.filter(item => item.ipnet === ipnet);
      if (current.length) {
        const [{ usedRatios }] = current;
        const [labels, value] = valuesParser(usedRatios);
        this.dhcpUsageLabels = labels;
        this.dhcpUsageValues = value;
      }
    },

    packetsVersion(val) {

      this.dhcpValues = this.packetsList.filter(item => item.version === val);
      this.showPacketsLine = false;

      // this.packetsList.forEach(item => {
      //   console.log(item)
      //   item.values.filter(v => v.value).forEach(item => {
      //     console.log(item.timestamp, item.value)
      //   })
      // })

      this.$nextTick().then(() => {
        this.showPacketsLine = true;

      });
    }

  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
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

    getNodeInfo(params) {
      this.intercept().then(_ => {
        this.$get({ params, ...this.$getApiByRoute(`/monitor/metric/nodes/${this.node}/dhcps`) }).then(({ data }) => {
          data.forEach(item => {

            if (item.id === "lps") {
              const [labels, value] = valuesParser(item.lps.values);
              this.dhcpLpsLabels = labels;
              this.dhcpLpsValues = value;
              this.lpsLinks = item.links;
            }

            if (item.id === "lease") {
              const [labels, value] = valuesParser(item.lease.values);
              this.dhcpLeaseLabels = labels;
              this.dhcpLeaseValues = value;
              this.leaseLinks = item.links;
            }

            if (item.id === "packets") {
              const [labels] = valuesParser(item.packets[0].values);
              this.dhcpLabels = labels;
              this.packetsList = item.packets;
              this.packetsLinks = item.links;

              this.packetsVersion = "4";
            }

            if (item.id === "subnetusedratios") {
              this.useageLinks = item.links;
              this.usageList = item.subnetusedratios.map(({ ipnet, usedRatios }) => {
                return {
                  ipnet,
                  usedRatios
                };
              });

              if (this.usageList.length) {
                this.useageIpnet = this.usageList[0].ipnet;
              }

            }

          });
        });
      }).catch(err => err);
    },

    getSubnetUsedRatioList(params) {
      this.intercept().then(_ => {
        const temp = this.useageIpnet;
        this.useageIpnet = "";
        this.$get({ params, url: this.useageLinks.self }).then(({ subnetusedratios }) => {
          this.usageList = subnetusedratios.map(({ ipnet, usedRatios }) => {
            return {
              ipnet,
              usedRatios
            };
          });
          this.useageIpnet = temp;
        });
      }).catch(err => err);
    },

    getLpsList(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.lpsLinks.self }).then(({ lps: { values } }) => {
          const [labels, value] = valuesParser(values);
          this.dhcpLpsLabels = labels;
          this.dhcpLpsValues = value;
        }).catch(err => err);
      });
    },

    getLeaseList(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.leaseLinks.self }).then(({ lease: { values } }) => {
          const [labels, value] = valuesParser(values);
          this.dhcpLeaseLabels = labels;
          this.dhcpLeaseValues = value;
        }).catch(err => err);
      });
    },

    getPacketList(params) {
      const tempVersion = this.packetsVersion;
      this.packetsVersion = 0;
      this.showPacketsLine = false;

      this.intercept().then(_ => {
        this.$get({ params, url: this.packetsLinks.self }).then(({ packets }) => {
          console.log(packets)
          const [labels, values] = valuesParser(packets[0].values);
          this.dhcpLabels = labels;
          this.packetsList = packets;

          this.packetsVersion = tempVersion;
          this.$nextTick().then(() => {
            this.showPacketsLine = true;

          });
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