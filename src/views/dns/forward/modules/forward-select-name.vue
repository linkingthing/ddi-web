<template>
  <div class="forward-select-name">
    <i-select
      :value="selectValue"
      @on-change="handleSelectChange"
    >
      <i-option
        v-for="item in nameList"
        :value="item.value"
        :key="item.value"
      >{{ item.label }}</i-option>
    </i-select>
    <i-input
      v-model="name"
      v-if="showInput"
      @on-change="handleInputChange"
    />
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
    this.nameList = [
      {
        value: ".",
        label: "根区"
      },
      {
        value: "name",
        label: "域名"
      }
    ];
    return {
      selectValue: "",
      name: "",
      showInput: false
    };
  },

  watch: {
    value(value) {
      console.log("props input", value)
      if (value !== "." && value.trim() !== "") {
        this.showInput = value !== "." && value.trim() !== "";
      }
      if (value === ".") {
        this.selectValue = ".";
      } else {
        this.selectValue = "name";
      }
      this.name = value;
    },
    name(value) {
      if (value.trim() !== "") {
        this.$emit("input", value);
      }
    }

  },
  created() { },
  mounted() { },
  methods: {
    handleSelectChange(value) {

      this.selectValue = value;
      if (value === ".") {
        this.$emit("input", value);
        this.showInput = false;
      } else {
        this.$emit("input", "");
        this.showInput = true;
      }
    },
    handleInputChange(event) {
      console.log('handleInputChange', event);
     
      // this.$emit("input", data);
      // todo: 没搞懂为什么通过事件抛出 name 始终不会变，但是通过watch解决了这个问题
    }
  }
};
</script>

<style lang="less" scoped>
</style>