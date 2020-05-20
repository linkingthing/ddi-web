<template>
  <div class="">
    <Checkbox v-model="disabled">启用</Checkbox>
    <Select
      :disabled="!disabled"
      :value="value"
      style="width:200px"
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
    }
  },
  data() {
    return {
      disabled: false,
      clientClassList: [],
      clientclasses: ""
    };
  },
  watch: {
    disabled(val) {
      if (!val) {
        this.$emit("input", "");
      }
    }
  },
  created() {
    this.$get({ url: "/apis/linkingthing.com/dhcp/v1/clientclasses" }).then(res => {
      this.clientClassList = res;
      this.disabled = !!this.value;
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