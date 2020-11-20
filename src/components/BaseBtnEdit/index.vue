<template>
  <btn-line
    title="编辑"
    @click="$emit('click')"
  ></btn-line>
</template>

<script>
export default {};
</script>

<style lang="less">
.btn-edit {
  font-size: 18px;
  // margin-left: 16px;
  color: #6a94ea !important;
  cursor: pointer;
}
.icon-m-edit {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  background-image: url(./icon-edit.png);
}
</style>

