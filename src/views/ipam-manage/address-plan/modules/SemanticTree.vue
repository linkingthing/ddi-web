<template>
  <div class="SemanticTree">
    <SemanticTreeHeader :prefix="prefix" />

    <p class="">请在右侧进行规划布局</p>
    SemanticTree
  </div>
</template>

<script>
import SemanticTreeHeader from "./SemanticTreeHeader";
export default {
  components: {
    SemanticTreeHeader
  },
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
.SemanticTree {
  width: 430px;
  background: #f6f6f6;
  border-radius: 4px;
  padding: 20px;
}
</style>