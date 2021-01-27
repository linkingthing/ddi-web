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
        title="地址池使用率"
        v-model="usageTime"
        :download="useageLinks"
      >
        <template v-slot:right>
          <Select
            style="width: 100px;margin-right: 20px"
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
          line-theme="color1"
          :labels="dhcpUsageLabels"
          :values="dhcpUsageValues"
          :isTimeOut="dhcpTimeOut"
        />
      </Card>

      <Card
        title="LPS统计"
        v-model="lpsTime"
        :download="lpsLinks"
      >
        <line-bar
          line-theme="color2"
          :labels="dhcpLpsLabels"
          :values="dhcpLpsValues"
          series-name="LPS统计"
          :isTimeOut="dhcpLpsTimeOut"
        />
      </Card>

      <Card
        title="DHCP报文统计"
        v-model="dhcpTime"
        :download="packetsLinks"
      >
        <template v-slot:right>
          <Select
            style="width: 100px;margin-right: 20px"
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
          :isTimeOut="dhcpValueTimeOut"
        />
      </Card>

      <Card
        title="Leases总量统计"
        v-model="leaseTime"
        :download="leaseLinks"
      >
        <line-bar
          line-theme="color4"
          :labels="dhcpLeaseLabels"
          :values="dhcpLeaseValues"
          series-name="Leases总量"
          :isTimeOut="dhcpLeaseTimeOut"
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

      lpsTime: "",
      lpsLinks: {},
      dhcpLpsLabels: [],
      dhcpLpsValues: [],
      dhcpLpsTimeOut: false,

      dhcpTime: "",
      packetsLinks: {},
      dhcpLabels: [],
      dhcpValues: [],
      dhcpValueTimeOut: false,
      keepShowPacketsVersion: "",
      packetsVersion: "",
      packetsList: [],
      showPacketsLine: false,


      usageTime: "",
      useageLinks: {},
      dhcpUsageLabels: [],
      dhcpUsageValues: [],
      dhcpTimeOut: false,

      leaseTime: "",
      leaseLinks: {},
      dhcpLeaseLabels: [],
      dhcpLeaseValues: [],
      dhcpLeaseTimeOut: false,

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

    usageTime(date) {
      this.getSubnetUsedRatioList({ from: date, to: date });
    },

    dhcpTime(date) {
      this.getPacketList({ from: date, to: date });
    },

    leaseTime(date) {
      this.getLeaseList({ from: date, to: date });
    },

    lpsTime(date) {
      this.getLpsList({ from: date, to: date });
    },
    keepShowUseageIpnet(val) {
      this.useageIpnet = val;
    },
    useageIpnet(ipnet) {
      const current = this.usageList.filter(item => item.ipnet === ipnet);
      if (current.length) {
        const [{ usedRatios }] = current;
        const [labels, value] = valuesParser(usedRatios || []);
        this.dhcpUsageLabels = labels;
        this.dhcpUsageValues = value;
        this.dhcpTimeOut = false;
      } else {
        this.dhcpTimeOut = true;
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


    // this.timer = setInterval(this.getAllInfo, 10000);
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

    getAllInfo() {
      this.getSubnetUsedRatioList({ from: this.usageTime, to: this.usageTime });

      this.getPacketList({ from: this.dhcpTime, to: this.dhcpTime });

      this.getLeaseList({ from: this.leaseTime, to: this.leaseTime });

      this.getLpsList({ from: this.lpsTime, to: this.lpsTime });
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
              this.lpsLinks = item.links;
            }

            if (item.id === "lease") {
              this.leaseLinks = item.links;
            }

            if (item.id === "packets") {

              this.packetsLinks = item.links;

              this.keepShowPacketsVersion = "4";
              this.packetsVersion = 0;
              this.$nextTick().then(() => {
                this.packetsVersion = this.keepShowPacketsVersion;
              })
            }

            if (item.id === "subnetusedratios") {
              this.useageLinks = item.links;

              if (this.usageList.length) {
                this.keepShowUseageIpnet = this.usageList[0].ipnet;
              }

            }

          });
        }).then(() => {
          setTimeout(this.getAllInfo, 0)
        });
      })
    },

    getSubnetUsedRatioList(params) {
      this.intercept().then(() => {
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
            if (this.usageList.length) {
              this.keepShowUseageIpnet = this.usageList[0].ipnet;
            }
          } else {
            this.usageList = [];
            this.keepShowUseageIpnet = "";
            this.dhcpUsageLabels = [];
            this.dhcpUsageValues = [];
          }

          this.useageIpnet = temp;
        });
      }).catch(err => err);
    },

    getLpsList(params) {
      this.intercept().then(() => {
        this.$get({ params, url: this.lpsLinks.self }).then(({ lps: { values } }) => {
          const [labels, value] = valuesParser(values || []);
          this.dhcpLpsLabels = labels;
          this.dhcpLpsValues = value;
          this.dhcpLpsTimeOut = false;
        }).catch(err => {
          this.dhcpLpsTimeOut = true;
        });
      });
    },

    getLeaseList(params) {
      this.intercept().then(() => {
        this.$get({ params, url: this.leaseLinks.self }).then(({ lease: { values } }) => {
          const [labels, value] = valuesParser(values || []);
          this.dhcpLeaseLabels = labels;
          this.dhcpLeaseValues = value;
          this.dhcpLeaseTimeOut = false;
        }).catch(() => {
          this.dhcpLeaseTimeOut = true;
        });
      });
    },

    getPacketList(params) {
      const tempVersion = this.packetsVersion;
      this.packetsVersion = 0;
      this.showPacketsLine = false;

      this.intercept().then(() => {
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
          this.dhcpValueTimeOut = false;
        }).catch(() => {
          this.dhcpValueTimeOut = true;
        });
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