<template>
  <i
    class="icon-m-reset btn-edit"
    @click="$emit('click')"
  />
</template>

<script>
export default {};
</script>

<style lang="less" >
.btn-edit {
  font-size: 18px;
  // margin-left: 16px;
  color: #6a94ea !important;
  cursor: pointer;
}
.icon-m-reset {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  background-image: url(./icon-reset.png);
  margin-right: 16px;
}
</style>

