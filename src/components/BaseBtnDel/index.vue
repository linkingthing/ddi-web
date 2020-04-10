<template>
  <span class="btn-del" @click="$emit('click')">删除</span>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.btn-del {
  font-size: 15px;
  margin: 0 8px;
  color: #fd8f64 !important;
  cursor: pointer;
}
</style>

