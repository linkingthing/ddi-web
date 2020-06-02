<template>
  <div
    class="server-info"
    v-if="visible"
  >
    <div class="server-info-header">
      <h3>备份服务器</h3>
      <div class="useage">
        <dl>
          <dt class="error">{{server.cpuUsage&&Number(server.cpuUsage[0].value).toFixed(2)}}%</dt>
          <dd>cpu使用率</dd>
        </dl>
        <dl>
          <dt class="warn">{{server.memoryUsage&& parseInt(server.memoryUsage[0].ratio)}}%</dt>
          <dd>内存占用率</dd>
        </dl>
      </div>
    </div>
    <div class="server-info-base">
      <ul>
        <li>
          <label>
            服务器名称
          </label>
          <span>
            {{server.hostName}}
          </span>
        </li>
        <li>
          <label>
            服务器IP
          </label>
          <span>
            {{server.ip}}
          </span>
        </li>
        <li>
          <label>
            状态
          </label>
          <span :class="serverStatus">
            {{server.nodeIsAlive ? "在线" : "离线"}}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    server: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
    };
  },
  computed: {
    serverStatus() {
      return this.server.nodeIsAlive ? "success" : "error";
    }
  },
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>
.server-info {
  margin-left: 500px;
  width: 256px;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0.7;
  border-radius: 4px;
  color: #fff;

  .server-info-header {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);

    h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .useage {
      display: flex;
      justify-content: space-between;
      dt {
        font-size: 24px;
        font-weight: bold;
        &.error {
          color: #dc463e;
        }
        &.warn {
          color: #fe9936;
        }
      }
      dd {
        opacity: 0.5;
      }
    }
  }

  .server-info-base {
    padding: 20px 24px;
    li {
      display: flex;
      line-height: 20px;
      & + li {
        margin-top: 12px;
      }
    }
    label {
      display: block;
      width: 110px;
      opacity: 0.5;
    }
    span {
      flex: 1;
      word-break: break-word;
      &.success {
        color: #51d650;
      }
      &.error {
        color: #f15e5e;
      }
    }
  }
}
</style>