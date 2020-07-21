<template>
  <div class="common-tab">
    <span
      @click="handleClick(item)"
      class="common-tab-item"
      v-for="(item) in tabList"
      :key="item.name"
      :class="{active: item.name === value}"
    >
      {{item.label}}
    </span>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ""
    },
    tabList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
    };
  },
  computed: {},
  created() { },
  mounted() { },
  methods: {
    handleClick(item) {
      this.$emit("on-tab", item);
    }
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.common-tab {
  font-size: 18px;
  .common-tab-item {
    position: relative;
    display: inline-block;
    font-weight: bold;
    margin-right: 60px;
    color: #999;
    cursor: pointer;
  }
  .active {
    color: #2d8cf0;
    &::after {
      content: "";
      display: block;
      height: 2px;
      width: 100%;
      box-sizing: border-box;
      background-color: #2d8cf0;
      position: absolute;
      left: 0;
      bottom: -10px;
      z-index: 1;
      transition: transform 0.3s ease-in-out;
      transform-origin: 0 0;
    }
  }
}
</style>