<template>
  <Input
    class="DomainServers"
    v-model="innerValue"
    :disabled="disabled"
  />
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      innerValue: ""
    };
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        if (Array.isArray(value)) {
          this.innerValue = value.join(",");
        } else {
          this.innerValue = ""
        }
      }
    },
    innerValue(value) {
      const result = value.split(",");
      this.$emit("change", result)
    }
  },
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>