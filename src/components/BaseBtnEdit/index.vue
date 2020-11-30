<template>
  <btn-line
    title="编辑"
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

