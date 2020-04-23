<template>
  <span class="btn-edit" @click="$emit('click')">编辑</span>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.btn-edit {
  font-size: 15px;
  margin: 0 8px;
  color: rgba(71, 179, 255, 0.8) !important;
  cursor: pointer;
}
</style>

