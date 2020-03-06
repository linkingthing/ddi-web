<template>
  <div class="ControllerDashboard dashboard">
    <h1 class="d-title">Conroller服务器</h1>

    <Row type="flex" justify="space-between" style="margin-bottom: 50px">
      <i-col span="11">
        <Card title="服务器信息" :infos="infos">
          <DeviceInfo />
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
export default {
  name: "ControllerDashboard ",
  components: { Card, DeviceInfo, "line-bar": Line, Pie },
  props: {},
  data() {
    return {
      infos: ["服务器名称：Server2", "服务器IP：10.1.1.2"],
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
  mounted() {},
  methods: {},
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