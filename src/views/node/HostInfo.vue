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
      infos: [],
      timer: null
    };
  },
  mounted() {
    this.getDeviceInfo();
    this.timer = setInterval(() => {
      this.getDeviceInfo();
    }, 3000);
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
  watch: {},
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="less" scoped>
</style>