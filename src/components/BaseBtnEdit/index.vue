<template>
  <Icon
    type="ios-create-outline"
    class="btn-edit"
    @click="$emit('click')"
  />
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.btn-edit {
  font-size: 18px;
  margin: 0 8px;
  color: #6A94EA !important;
  cursor: pointer;
}
</style>

