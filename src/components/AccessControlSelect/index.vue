<template>
  <Select
    filterable
    style="width: 200px"
    :value="value"
    @on-change="(d) => $emit('change',d,accessList.find(item => item.id === d) )"
  >
    <Option
      v-for="item in accessList"
      :key="item.id"
      :value="item.id"
    >{{item.name}}</Option>
  </Select>
</template>

<script>
import services from "../../services";
export default {
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      accessList: []
    };
  },
  created() {
    this.getAccessList();
  },
  methods: {
    getAccessList() {
      services.getAccessList().then(({ data }) => {
        this.accessList = data;
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>