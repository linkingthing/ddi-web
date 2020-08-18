<template>
  <div class="SemanticTreeHeader">
    <h3 class="prefix">{{prefix}}</h3>
    <Input
      class="search"
      search
      enter-button
      placeholder="搜索分支"
    />

  </div>
</template>

<script>
export default {
  components: {},
  props: {
    prefix: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>
.SemanticTreeHeader {
  display: flex;
  justify-content: space-between;
  .prefix {
    font-size: 16px;
    color: #333;
    line-height: 32px;
  }
  .search {
    width: 200px;
  }
}
</style>