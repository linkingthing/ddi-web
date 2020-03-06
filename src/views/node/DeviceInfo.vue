<template>
  <div class="deviceInfo">
    <Row>
      <i-col span="8">
        <i-circle :percent="80" :size="155" stroke-color="#92CBAF">
          <span class="circle-inner" style="font-size:24px">
            <strong>80%</strong>
            <p>内存使用率</p>
          </span>
        </i-circle>
      </i-col>
      <i-col span="8">
        <i-circle :percent="80" :size="155" stroke-color="#F7CF93">
          <span class="circle-inner" style="font-size:24px">
            <strong>80%</strong>
            <p>cpu使用率</p>
          </span>
        </i-circle>
      </i-col>
      <i-col span="8">
        <i-circle :percent="80" :size="155" stroke-color="#E99C7F">
          <span class="circle-inner" style="font-size:24px">
            <strong>80%</strong>
            <p>磁盘使用率</p>
          </span>
        </i-circle>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
  watch: {}
};
</script>

<style lang="less" scoped>
.deviceInfo {
  padding-top: 60px;
}
.circle-inner {
  color: #697075;

  strong {
    font-size: 24px;
  }
  p {
    padding-top: 15px;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>