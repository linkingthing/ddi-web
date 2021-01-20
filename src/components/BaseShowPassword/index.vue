<template>
  <div class="BaseShowPassword">
    ********
    <Icon
      class="icon-edit"
      @click="click()"
    />

  </div>
</template>

<script>
export default {
  props: {
    click: {
      type: Function,
      default: () => { }
    }
  }
};
</script>

<style lang="less" scoped>
.BaseShowPassword {
  letter-spacing: 3px;
  .icon-edit {
    font-size: 20px;
    cursor: pointer;
    &:hover {
      color: #4586FE;
    }
  }
}
</style>