<template>
  <Icon class="btn-icon btn-del" type="md-close" @click="$emit('click')" />
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.btn-icon {
  font-size: 20px;
  cursor: pointer;
}
.btn-del {
  color: #eb5e28;
}
</style>

