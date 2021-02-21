<template>
  <div class="CommonEditText">
    <Input
      ref="input"
      @on-blur="handleBlur"
      v-model="innerValue"
      v-if="isEdit"
    />
    <span
      @dblclick="handleDBClick"
      v-else
    >{{innerValue}}</span>
  </div>
</template>

<script>
export default {
  components: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      innerValue: "",
      isEdit: false,
    };
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.innerValue = val;
      }
    },
    innerValue(val, old) {
      if (old !== val) {
        // this.$emit("change", val);
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleBlur() {
      this.isEdit = false;
      if (this.innerValue !== this.value) {
        this.$emit("change", this.innerValue);
      }
    },
    handleDBClick() {
      this.isEdit = true;
      this.$nextTick().then(() => {
        this.$refs.input.focus({
          cursor: "end"
        });
      })
    }
  }
};
</script>

<style lang="less" scoped>
.CommonEditText {
  display: inline-block;
  cursor: pointer;
  span {
    padding: 4px;
    border-radius: 4px;
    border: 1px solid transparent;
    transition: all 0.6s;

    &:hover {
      border-color: #ddd;
      box-shadow: 0 0 3px #ddd;
    }
  }
}
</style>