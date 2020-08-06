<template>
  <Spin
    fix
    size="large"
    class="loading-custom"
    :class="{'is-global': global}"
  >
    <Icon
      type="ios-loading"
      size="18"
      class="spin-icon-load"/>
    <div>{{text}}</div>
  </Spin>
</template>

<script>
export default {
  name: "IviewLoading",

  props: {
    text: {
      type: String,
      default: "加载中"
    },

    global: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>