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
    display: inline-block;
    font-weight: bold;
    margin-right: 60px;
    color: #999;
    cursor: pointer;
  }
  .active {
    color: #333;
  }
}
</style>