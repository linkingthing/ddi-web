<template>
  <i
    class="icon-wangluo-copy btn-detect"
    @click="$emit('click')"
  >
    网络探测
  </i>
</template>

<script>
export default {};
</script>

<style lang="less">
.btn-detect {
  margin-left: 16px;
  color: #6a94ea !important;
  cursor: pointer;
}
</style>

