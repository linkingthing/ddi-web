<template>
  <Spin
    fix
    size="large"
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
    }
  }
};
</script>