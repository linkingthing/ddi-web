<template>
  <span
    class="icon-base"
    @click="disabled || $emit('click')"
    :style="`backgroundImage: url(${require(`${bg}`)});cursor: ${disabled && 'initial'}`"
  />

</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "up"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bg() {
      return `./move-${this.type}${this.disabled ? "-gray" : ""}.png`;
    }
  }
};
</script>

<style lang="less" scoped>
.icon-base {
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 10px;
  background-size: cover;
  vertical-align: bottom;
}
</style>

