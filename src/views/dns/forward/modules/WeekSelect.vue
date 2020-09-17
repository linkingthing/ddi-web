<template>
  <Select v-model="innervalue">
    <Option
      v-for="item in weekdayList"
      :key="item.value"
      :value="item.value"
    >{{ item.label}}</Option>
  </Select>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Number,
      default: undefined
    }
  },
  data() {

    this.weekdayList = [{
      label: "星期日",
      value: 0
    }, {
      label: "星期一",
      value: 1
    }, {
      label: "星期二",
      value: 2
    }, {
      label: "星期三",
      value: 3
    }, {
      label: "星期四",
      value: 4
    }, {
      label: "星期五",
      value: 5
    }, {
      label: "星期六",
      value: 6
    }];
    return {
      innervalue: ""
    };
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      handler(val, old) {
        if (val && val !== old) {
          this.innervalue = val;
        }
      }
    },
    innervalue(val) {
      this.$emit("input", val);
    }
  },
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>