<template>
  <div class="spinner">
    <Input
      v-model.trim="innerValue"
      :placeholder="placeholder"
      :disabled="disabled"
    >
    <span
      class="btn-count"
      slot="prepend"
      @click="handleSubtractionCount"
    >-</span>
    <span
      slot="append"
      class="btn-count"
      @click="handlePlusCount"
    >+</span>
    </Input>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: "",
    placeholder: "",
    disabled: false
  },
  data() {
    return {
      innerValue: ""
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.innerValue = val;
    },
    innerValue(val, old) {
      this.$emit("input", Number(val))
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleSubtractionCount() {
      if (!this.disabled) {
        this.innerValue -= 1;
      }
    },
    handlePlusCount() {
      if (!this.disabled) {
        this.innerValue += 1;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.btn-count {
  cursor: pointer;
}
</style>