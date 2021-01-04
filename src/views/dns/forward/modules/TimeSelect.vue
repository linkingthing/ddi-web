<template>
  <TimePicker
    v-model="innervalue"
    format="HH:mm"
    placeholder="选择时间"
  ></TimePicker>

</template>

<script>
export default {
  components: {},
  props: {
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | String,
      default: undefined
    }
  },
  data() {
    return {
      innervalue: ""
    };
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      handler(val, old) {

        // if (typeof val === "string") {
        //   this.innervalue = "";
        // }
        if (typeof val === "string" && val !== old) {
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