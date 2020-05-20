<template>
  <i
    class="icon-edit btn-edit"
    @click="$emit('click')"
  />
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.btn-edit {
  font-size: 18px;
  margin-left: 16px;
  color: #6a94ea !important;
  cursor: pointer;
}
.icon-edit {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url(./icon-edit.png);
}
</style>

