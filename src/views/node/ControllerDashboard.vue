<template>
  <div class="ControllerDashboard dashboard">
    <h1 class="d-title">Conroller服务器</h1>

    <Row type="flex" justify="space-between" style="margin-bottom: 50px">
      <i-col span="11">
        <Card title="服务器信息" :infos="infos">
          <DeviceInfo :deviceState="deviceState" />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="CPU利用率">
          <line-bar :labels="[2015,2016,2017,2020,2030]" :values="[25,22,63,40,21]"></line-bar>
        </Card>
      </i-col>
    </Row>

    <Row type="flex" justify="space-between">
      <i-col span="11">
        <Card title="内存利用率">
          <line-bar
            lineTheme="purple"
            :labels="[2015,2016,2017,2020,2030]"
            :values="[25,22,63,40,21]"
          ></line-bar>
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="磁盘利用率">
          <line-bar
            lineTheme="brown"
            :labels="[2015,2016,2017,2020,2030]"
            :values="[25,22,63,40,21]"
          ></line-bar>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import Card from "./Card";
import DeviceInfo from "./DeviceInfo";
import Line from "./Line";
import Pie from "./Pie";
import services from "@/services";

export default {
  name: "ControllerDashboard",
  components: { Card, DeviceInfo, "line-bar": Line, Pie },
  props: {},
  data() {
    return {
      deviceState: {},
      infos: [],
      ipColumns: [
        {
          title: "子网名称",
          key: "",
          align: "center"
        },
        {
          title: "网络地址",
          key: "",
          align: "center"
        },
        {
          title: "地址总量",
          key: "",
          align: "center"
        },
        {
          title: "已分配数量",
          key: "",
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
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getDeviceInfo();
    this.getDeviceHistoryInfo();
  },
  methods: {
    getDeviceInfo() {
      const ip = this.$route.query.ip;
      services.getNodeList({ node: ip }).then(res => {
        const result = res.data.data;
        this.deviceState = result.usage[ip];
        const deviceInfo = result.nodes[ip];
        this.infos = [
          `服务器名称：${deviceInfo.hostname}`,
          `服务器IP：${deviceInfo.ip}`
        ];
      });
    },
    getDeviceHistoryInfo() {
      const params = {
        node: this.$route.query.ip,
        type: "cpu",
        start: (new Date().getTime() - 7 * 24 * 60 * 60 * 1000) / 1000,
        end: new Date().getTime() / 1000,
        step: 150
      };
      services.getDeviceHistoryInfo(params).then(res => {
        console.log(res.data.data);
      });
    }
  },
  watch: {}
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