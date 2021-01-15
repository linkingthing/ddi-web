<template>
  <div class="IPListInput">
    <!-- <Input
      search
      placeholder="输入ip,回车过滤查找"
      v-model="search"
      @on-search="handleFilter"
    /> -->
    <Input
      style="width: 100%"
      v-model="showIpList"
      type="textarea"
      :autosize="{minRows: 4,maxRows: 6}"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
import { debounce } from "lodash";
export default {
  components: {},
  props: {
    placeholder: {
      type: String,
      default: "请输入"
    },
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      innerValue: [],
      hideValue: [],
      search: "",
    };
  },
  computed: {
    showIpList: {
      get() {
        this.hideValue = this.innerValue.filter(item => !item.includes(this.search.trim()));
        return this.innerValue.filter(item => item.includes(this.search.trim())).join("\n");
      },
      set(val) {
        const showValue =  val.split("\n");
        this.innerValue =showValue;
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        this.innerValue = value;
      }
    },
    innerValue: debounce(function (value) {
      this.$emit("input", value);
    }, 400),
  },
  created() { },
  mounted() { },
  methods: {
    handleFilter() {

    }
  }
};
</script>

<style lang="less" scoped>
.IPListInput {
  display: block;
  width: 100%;
}
</style>