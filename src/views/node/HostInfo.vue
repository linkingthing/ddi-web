<template>
  <Card title="服务器信息" :infos="infos">
    <DeviceInfo :deviceState="deviceState" />
  </Card>
</template>

<script>
import Card from "./Card";
import DeviceInfo from "./DeviceInfo";
import services from "@/services";

export default {
  components: {
    Card,
    DeviceInfo
  },
  props: {},
  data() {
    return {
      deviceState: {},
      infos: []
    };
  },
  mounted() {
    this.getDeviceInfo();
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
    }
  },
  watch: {}
};
</script>

<style lang="less" scoped>
</style>