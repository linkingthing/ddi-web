<template>
  <btn-line
    title="删除"
    @click="$emit('click')"
  ></btn-line>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.btn-del {
  font-size: 15px;
  margin-left: 16px;
  color: #fd8f64 !important;
  cursor: pointer;
}
.icon-m-del {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url(./icon-delete.png);
  vertical-align: bottom;
}
</style>

