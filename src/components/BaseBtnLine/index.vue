<template>
  <a
    href="javascript:;"
    class="btn-line"
    :class="{'btn-disabeled': disabled}"
    @click="!disabled && $emit('click')"
    :style="{
      color:color,
      borderColor:color
    }"
  >{{title}}</a>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#4686fe"
    },
    title: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="less">
.btn-line {
  display: inline-block;
  line-height: 24px;
  padding: 0 8px;
  height: 26px;
  font-size: 12px;
  border: 1px solid #4686fe;
  border-radius: 4px;
  cursor: pointer;
  &.btn-disabeled {
    color: #ddd !important;
    border-color: #ddd;
    cursor: not-allowed;
  }
}
</style>