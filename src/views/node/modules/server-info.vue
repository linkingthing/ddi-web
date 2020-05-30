<template>
  <div class="server-info">
    <div class="server-info-header">
      <h3>备份服务器</h3>
      <div class="useage">
        <dl>
          <dt class="error">89%</dt>
          <dd>cpu使用率</dd>
        </dl>
        <dl>
          <dt class="warn">56.3%</dt>
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
            Nubility
          </span>
        </li>
        <li>
          <label>
            服务器IP
          </label>
          <span>
            192.168.12.1
          </span>
        </li>
        <li>
          <label>
            状态
          </label>
          <span class="success">
            在线
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
    };
  },
  computed: {},
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
          color: #DC463E;
        }
        &.warn {
          color: #FE9936;
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
        color: #51D650;
      }
    }
  }
}
</style>