<template>
  <div class="DNSDashboard dashboard">
    <h1 class="d-title">DNS服务器</h1>

    <Row type="flex" justify="space-between" style="margin-bottom: 50px">
      <i-col span="11">
        <HostInfo />
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
          <Table :data="domains" :columns="topDomainColumns" style="padding-top: 30px" />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="TOP请求IP">
          <Table :data="ips" :columns="topIPColumns" style="padding-top: 30px" />
        </Card>
      </i-col>
    </Row>
    <Row type="flex" justify="space-between">
      <i-col span="11">
        <Card title="解析状态">
          <Pie  />
        </Card>
      </i-col>
      <i-col span="11">
        <Card title="解析类型">
          <Pie :values="types" />
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
import services from "@/services";

export default {
  name: "DNSDashboard",
  components: { Card, HostInfo, "line-bar": Line, Pie },
  props: {},
  data() {
    return {
      infos: ["服务器名称：Server2", "服务器IP：10.1.1.2"],
      topDomainColumns: [
        {
          title: "排名",
          type: "index",
          align: "center"
        },
        {
          title: "域名",
          key: "key",
          align: "center"
        },
        {
          title: "统计次数",
          key: "doc_count",
          align: "center"
        }
      ],
      topIPColumns: [
        {
          title: "排名",
          type: "index",
          align: "center"
        },
        {
          title: "IP地址",
          key: "key",
          align: "center"
        },
        {
          title: "统计次数",
          key: "doc_count",
          align: "center"
        }
      ],
      qps: [],
      ips: [],
      domains: [],
      types: []
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getDNSTop();
    this.getQpsList();
  },
  methods: {
    getQpsList () {
       const params = {
        node: this.$route.query.ip,
        type: "qps",
        start: (new Date().getTime() - 7 * 24 * 60 * 60 * 1000) / 1000,
        end: new Date().getTime() / 1000,
        step: 150
      };
      services.getDeviceHistoryInfo(params).then(res => {

      })
    },
    getDNSTop() {
      services
        .getDNSTop()
        .then(res => {
          console.log(res);
          const { ips, domains, types } = res.data;
          this.ips = ips;
          this.domains = domains;
          this.types = types;
        })
        .catch(err => err);
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