<template>
  <div class="">
    <Checkbox v-model="innerDisabled" :disabled="disabled">启用</Checkbox>
    <Select
      :disabled="disabled || !innerDisabled"
      :value="value"
      style="width:180px"
      @on-change="handleChange"
    >
      <Option
        v-for="item in clientClassList"
        :value="item.name"
        :key="item.name"
      >{{ item.name }}</Option>
    </Select>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      innerDisabled: false,
      clientClassList: [],
      clientclasses: ""
    };
  },
  watch: {
    innerDisabled(val) {
      if (!val) {
        this.$emit("input", "");
      }
    },
    value: {
      immediate: true,
      handler(value) {
        console.log(value)
        if (value) {
          this.innerDisabled = true;
        } else {
          this.innerDisabled = false;
        }
      }
    }
  },
  created() {
    this.$get({ url: "/apis/linkingthing.com/dhcp/v1/clientclasses" }).then(({ data }) => {
      this.clientClassList = data;
      this.innerDisabled = !!this.value;
    });
  },
  methods: {
    handleChange(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style lang="less" scoped>
</style>