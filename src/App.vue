<template>
  <div id="app">
    <router-view/>
    <!-- laoding预加载 -->
    <div
      class="load-out"
      style="height: 38px;width: 38px;position: absolute;left: -1000px;top: -1000px;"
    >
      <Icon
        type="ios-loading"
        size="38"
        class="demo-spin-icon-load"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  created() {},
  mounted() {}
};
</script>

<style lang="less">
@import "./assets/less/global";
@import "./assets/less/index";
@import "./assets/less/dns";
</style>
