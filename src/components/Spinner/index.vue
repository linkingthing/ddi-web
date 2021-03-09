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
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    }
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
      handler(val) {
        this.innerValue = val || "";
      },
    },
    innerValue(val) {
      this.$emit("input", Number(val));
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleSubtractionCount() {

      if (typeof this.min === "number") {
        if (this.innerValue > this.min) {
          if (!this.disabled) {
            this.innerValue -= 1;
          }
        }
      } else {
        if (!this.disabled) {
          this.innerValue -= 1;
        }
      }

    },
    handlePlusCount() {
      if (typeof this.max === "number") {
        if (this.innerValue < this.max) {
          if (!this.disabled) {
            this.innerValue += 1;
          }
        }
      } else {
        if (!this.disabled) {
          this.innerValue += 1;
        }
      }

    }
  }
};
</script>

<style lang="less" scoped>
.btn-count {
  cursor: pointer;
  display: block;
  width: 16px;
  text-align: center;
  user-select: none;
}
</style>