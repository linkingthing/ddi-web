<template>
  <div class="AddressTypeTab">
    <ul>
      <li
        :class="{active: item.id === active}"
        v-for="item in tabList "
        :key="item.id"
        @click="$emit('change', item.id)"
      >
        {{item.title}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    active: {
      type: String,
      default: ""
    }
  },
  data() {
    this.tabList = [{
      title: "IPv6",
      id: "IPv6"
    }, {
      title: "IPv4",
      id: "IPv4"
    }];
    return {
    };
  }
};
</script>

<style lang="less" scoped>
.AddressTypeTab {
  ul {
    display: inline-flex;
  }
  li {
    display: block;
    height: 32px;
    padding: 6px 20px;
    font-size: 14px;
    color: #999;
    background: #ededed;
    border-radius: 4px;
    margin-right: 16px;
    cursor: pointer;
  }
  .active {
    color: #fff;
    background: #0383f1;
  }
}
</style>