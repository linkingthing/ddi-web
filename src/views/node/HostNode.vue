<template>
  <div
    class="hostNode host"
    @click="handleClick"
  >
    <div class="tiptool">
      <table>
        <tr>
          <td>服务器名称</td>
          <td>服务器IP</td>
        </tr>
        <tr>
          <td>{{host.hostname}}</td>
          <td>{{host.ip}}</td>
        </tr>
      </table>
    </div>
    <img
      src="../../assets/images/server-controller.png"
      v-if="host.role === 'controller'"
      alt
    >
    <img
      src="../../assets/images/server-dns.png"
      v-else-if="host.role === 'dns'"
      alt
    >
    <img
      src="../../assets/images/server-dhcp.png"
      v-else
      alt
    >

    <dl class="host-info">
      <dt>服务器类型</dt>
      <dd>
        {{host.role}}

        (<mark :style="{color: host.state ? '#41D15C':'#999'}">
          {{host.state ? "在线": "离线" }}
        </mark>)
      </dd>
    </dl>
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
  created() { },
  mounted() { },
  methods: {
    handleClick() {
      this.$emit("click");
    }
  },
  watch: {}
};
</script>

<style lang="less">
.hostNode {
  position: relative;
  cursor: pointer;
  .tiptool {
    opacity: 0;
    position: absolute;
    right: 160px;
    min-width: 90px;
    text-align: left;
    font-size: 12px;
    background: rgba(18, 18, 18, 0.4);
    color: #fff;
    padding: 4px 10px;
    border-radius: 4px;
    transition: all 0.8s;
    z-index: -10;

    td {
      padding: 4px 12px;
      font-size: 12px;
    }

    &::after {
      transition: all 1s;
      position: absolute;
      right: -16px;
      top: 20px;
      content: "";
      display: block;
      border-width: 8px;
      border-style: solid;
      border-color: transparent transparent transparent rgba(18, 18, 18, 0.4);
    }
  }
  &:hover {
    .tiptool {
      opacity: 1;
      right: 180px;
      z-index: 10;
    }
  }
}
.host-info {
  display: inline-block;
  color: #333;
  margin-left: 12px;
  font-size: 14px;
  dt {
    font-size: 14px;
    text-align: left;
  }
  dd {
    font-size: 14px;
    color: #999;
  }
  mark {
    background: none;
  }
}
</style>