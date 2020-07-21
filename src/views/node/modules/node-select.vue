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
      this.$router.push({ query: { ip: val } });
    },
    value(val) {
      this.selectValue = val;
    }
  },
  created() {
    this.$get(this.$getApiByRoute("/monitor/metric/nodes")).then(({ data }) => {
      if (this.type === "controller") {
        this.nodeList = data;
      } else {
        this.nodeList = data.filter(item => {
          return item.roles.includes(this.type);
        });
      }

      if (this.nodeList.length) {
        const { ip } = this.$route.query;
        if (ip) {
          this.selectValue = ip;
        } else {
          this.selectValue = this.nodeList[0].id;
        }

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