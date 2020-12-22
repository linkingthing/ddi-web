<template>
  <div class="AddressTypeTab">
    <ul>
      <li
        :class="{active: item.id === active}"
        v-for="item in tabList "
        :key="item.id"
        @click="$emit('change', item.id, item)"
      >
        {{item.label}}
      </li>
    </ul>
  </div>
</template>

<script>
const tabList = [{
  label: "IPv6",
  id: "listviewv6"
}, {
  label: "IPv4",
  id: "listviewv4"
}];
export default {
  components: {},
  props: {
    active: {
      type: String,
      default: ""
    },
    tabList: {
      type: Array,
      default: () => {
        return tabList;
      }
    }
  },
  data() {

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
    margin-right: 8px;
    cursor: pointer;
  }
  .active {
    color: #fff;
    background: #0383f1;
  }
}
</style>