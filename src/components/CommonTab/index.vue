<template>
  <!-- <div class="common-tab">
    <span
      @click="handleClick(item)"
      class="common-tab-item"
      v-for="(item) in tabList"
      :key="item.name"
      :class="{active: item.name === value}"
    >
      {{item.label}}
    </span>
  </div> -->

  <AddressTypeTab
    class="common-tab"
    @change="handleClick"
    :tab-list="tabList"
    :active="active"
  />
</template>

<script>
import AddressTypeTab from "@/components/AddressTypeTab";

export default {
  components: {
    AddressTypeTab
  },
  props: {
    active: {
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
    handleClick(id, item) {
      this.$emit("change", id, item);
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