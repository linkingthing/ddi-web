<template>

  <Select
    class="node-select"
    v-model="selectValue"
  >
    <Option
      v-for="item in nodeList"
      :key="item.id"
      :value="item.id"
    >{{item.hostName}}</Option>
  </Select>
</template>

<script>
export default {
  components: {},
  props: {
    type: {
      type: String,
      default: "dns"
    },
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      nodeList: [],
      selectValue: ""
    };
  },
  computed: {},
  watch: {
    selectValue(val) {
      this.$emit("input", val)
    },
    value(val) {
      this.selectValue = val;
    }
  },
  created() {
    this.$get(this.$getApiByRoute("/monitor/metric/nodes")).then(({ data }) => {
      this.nodeList = data.filter(item => {
        return item.roles.includes(this.type);
      });
      if (this.nodeList.length) {
        this.selectValue = this.nodeList[0].id;
      }
    });
  },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>
.node-select {
  width: 150px;
  margin-left: 20px;
}
</style>