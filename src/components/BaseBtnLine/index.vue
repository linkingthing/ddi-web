<template>
  <a
    href="javascript:;"
    class="btn-line"
  >{{title}}</a>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
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
  color: #4686fe !important;
  border: 1px solid #4686fe;
  border-radius: 4px;
  cursor: pointer;
}
</style>