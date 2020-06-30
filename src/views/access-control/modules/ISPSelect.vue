<template>
  <Select
    :value="value"
    @on-change="handleSelect"
  >
    <Option
      v-for="item in ispList"
      :value="item.value"
      :key="item.value"
    >{{ item.label }}</Option>
  </Select>

</template>

<script>

export default {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    this.ispList = [{
      label: "中国移动",
      value: "cmcc"
    }, {
      label: "中国联通",
      value: "cucc"
    }, {
      label: "中国电信",
      value: "ctcc"
    }]
    return {
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handleSelect(val) {
      this.$emit('input', val);
    }
  }
};
</script>

<style lang="less" scoped>
</style>