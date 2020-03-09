<template>
  <div class="DNSDashboard dashboard">
    <h1 class="d-title">DNS服务器</h1>

    <Row type="flex" justify="space-between" style="margin-bottom: 50px">
      <i-col span="11">
        <Card title="服务器信息" :infos="infos">
          <DeviceInfo />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="QPS">
          <line-bar :labels="[2015,2016,2017,2020,2030]" :values="[25,22,63,40,21]"></line-bar>
        </Card>
      </i-col>
    </Row>
    <Row type="flex" justify="space-between" style="margin-bottom: 50px">
      <i-col span="11">
        <Card title="TOP请求域名">
          <Table :data="[]" :columns="topDomainColumns" style="padding-top: 30px" />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="TOP请求IP">
          <Table :data="[]" :columns="topIPColumns" style="padding-top: 30px" />
        </Card>
      </i-col>
    </Row>
    <Row type="flex" justify="space-between">
      <i-col span="11">
        <Card title="解析状态">
          <Pie />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="解析类型">
          <Pie />
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
  name: "DNSDashboard",
  components: { Card, DeviceInfo, "line-bar": Line, Pie },
  props: {},
  data() {
    return {
      infos: ["服务器名称：Server2", "服务器IP：10.1.1.2"],
      topDomainColumns: [
        {
          title: "排名",
          key: "",
          align: "center"
        },
        {
          title: "域名",
          key: "",
          align: "center"
        },
        {
          title: "统计次数",
          key: "",
          align: "center"
        }
      ],
      topIPColumns: [
        {
          title: "排名",
          key: "",
          align: "center"
        },
        {
          title: "IP地址",
          key: "",
          align: "center"
        },
        {
          title: "统计次数",
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