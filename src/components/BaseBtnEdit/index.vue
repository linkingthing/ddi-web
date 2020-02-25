<template>
  <Icon class="btn-icon btn-edit" type="ios-create-outline" @click="$emit('click')" />
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.btn-icon {
  font-size: 20px;
  cursor: pointer;
}
.btn-edit {
  color: #68b3c8;
}
</style>

