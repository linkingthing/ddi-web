<template>
  <div class="input-password">
    <Input
      :type="type"
      v-model="innerValue"
    />
    <Icon
      class="icon-eye"
      :class="type === 'password' ? 'icon-xianshi': 'icon-yincang'"
      @click="handleToggleType"
    />
  </div>
</template>

<script>
export default {
  
  components: {},
  model: {
    prop: "value",
    event: "change"
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
      type: "password"
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.innerValue = val;
    },
    innerValue(val) {
      console.log(val)
      this.$emit("change", val);
    }
  },
  created() {
  },
  mounted() { },
  methods: {
    handleToggleType() {
      if (this.type === "password") {
        this.type = "text";
      } else {
        this.type = "password";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.input-password {
  position: relative;
  width: 100%;
  .icon-eye {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>