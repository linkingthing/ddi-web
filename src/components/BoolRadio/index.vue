<template>
  <RadioGroup
    class="bool-radio"
    v-model="innerValue"
  >
    <Radio
      :label="item.value ? 'true': 'false'"
      :key="item.value"
      v-for="item in children"
    >{{item.label}}</Radio>

  </RadioGroup>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    children: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      innerValue: false
    };
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.innerValue = value ? "true" : "false";
      }
    },
    innerValue(value) {
      this.$emit("input", value === "true");
    }
  },
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>