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
            v-model="keepShowUseageIpnet"
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
            v-model="keepShowPacketsVersion"
          >
            <Option value="4">dhcp4</Option>
            <Option value="6">dhcp6</Option>
          </Select>
        </template>
        <line-bar
          :legend="legend"
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
      keepShowPacketsVersion: "",
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
      keepShowUseageIpnet: "",
      useageIpnet: "",

      legend: []
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
    keepShowUseageIpnet(val) {
      this.useageIpnet = val;
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

    keepShowPacketsVersion(val) {
      this.packetsVersion = val;
    },

    packetsVersion(val) {


      if (val) {
        if (val === "4") {
          this.legend = ["discover", "offer", "request", "ack"];
        } else {
          this.legend = ["solicit", "advertise", "request", "reply"];
        }

        this.dhcpValues = this.packetsList.filter(item => item.version === val);

      }

      this.showPacketsLine = false;

      this.$nextTick().then(() => {
        this.showPacketsLine = true;

      });
    }

  },
  mounted() {
    this.init();


    this.timer = setInterval(() => {

      this.getSubnetUsedRatioList({ period: this.usageTime });

      this.getPacketList({ period: this.dhcpTime });

      this.getLeaseList({ period: this.leaseTime });

      this.getLpsList({ period: this.lpsTime });

    }, 3000);
  },

  destroyed() {
    clearInterval(this.timer);
  },

  methods: {
    init() {
      this.dhcpValues = [];
      this.dhcpLabels = [];
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
              const [labels, value] = valuesParser(item.lps.values || []);
              this.dhcpLpsLabels = labels;
              this.dhcpLpsValues = value;
              this.lpsLinks = item.links;
            }

            if (item.id === "lease") {
              const [labels, value] = valuesParser(item.lease.values || []);
              this.dhcpLeaseLabels = labels;
              this.dhcpLeaseValues = value;
              this.leaseLinks = item.links;
            }

            if (item.id === "packets") {
              if (Array.isArray(item.packets) && item.packets.length) {
                const [labels] = valuesParser(item.packets[0].values);
                this.dhcpLabels = labels;
                this.packetsList = item.packets;
              } else {
                this.dhcpLabels = [];
                this.packetsList = [];
              }


              this.packetsLinks = item.links;

              this.keepShowPacketsVersion = "4";
            }

            if (item.id === "subnetusedratios") {
              this.useageLinks = item.links;

              if (Array.isArray(item.subnetusedratios)) {
                this.usageList = item.subnetusedratios.map(({ ipnet, usedRatios }) => {
                  return {
                    ipnet,
                    usedRatios
                  };
                });
              } else {
                this.usageList = [];
              }


              if (this.usageList.length) {
                this.keepShowUseageIpnet = this.usageList[0].ipnet;
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
          if (Array.isArray(subnetusedratios)) {
            this.usageList = subnetusedratios.map(({ ipnet, usedRatios }) => {
              return {
                ipnet,
                usedRatios
              };
            });
          } else {
            this.usageList = [];
          }

          this.useageIpnet = temp;
        });
      }).catch(err => err);
    },

    getLpsList(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.lpsLinks.self }).then(({ lps: { values } }) => {
          const [labels, value] = valuesParser(values || []);
          this.dhcpLpsLabels = labels;
          this.dhcpLpsValues = value;
        }).catch(err => err);
      });
    },

    getLeaseList(params) {
      this.intercept().then(_ => {
        this.$get({ params, url: this.leaseLinks.self }).then(({ lease: { values } }) => {
          const [labels, value] = valuesParser(values || []);
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

          if (Array.isArray(packets) && packets.length) {
            const [labels] = valuesParser(packets[0].values);
            this.dhcpLabels = labels;
            this.packetsList = packets;
          } else {
            this.dhcpLabels = [];
            this.packetsList = [];
          }


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