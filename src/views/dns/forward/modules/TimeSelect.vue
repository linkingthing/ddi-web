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
    // 空槽位 数组map不识别
    this.weekdayList = Array.from({ length: 25 }, (item, index) => {
      return {
        label: `${index}: 00`,
        value: index
      };
    });
    return {
      innervalue: ""
    };
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      handler(val, old) {
        if (typeof val === "number" && val !== old) {
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