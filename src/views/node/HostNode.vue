<template>
  <div class="hostNode host" @click="handleClick">
    <img src="../../assets/images/host.png" alt />
    <ul class="host-info">
      <li>图层服务器类型:{{host.role}}</li>
      <li>服务器名称: {{host.hostname}}</li>
      <li>服务器IP:{{host.ip}}</li>
      <li>
        服务器状态:
        <Badge :status="host.state ? 'success' : 'error'" />
        {{host.state ? "(在线)": "(利线)" }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    host: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleClick() {
      this.$emit('click')
    }
  },
  watch: {}
};
</script>

<style lang="less">
.hostNode {
  .ivu-badge-status-dot {
    width: 16px;
    height: 16px;
  }
}
.host-info {
  display: inline-block;
  color: #252422;
  margin-left: 12px;

  li {
    margin-bottom: 20px;
  }
}
</style>