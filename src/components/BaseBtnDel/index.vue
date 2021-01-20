<template>
  <btn-line
    title="删除"
    :disabled="disabled"
    @click.native="!disabled && $emit('click')"
  ></btn-line>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
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

