<template>
  <div class="SemanticTree">
    <SemanticTreeHeader :prefix="prefix" />

    <Tree :data="treeData" />

    <Button
      type="primary"
      long
    > 语义规划完成</Button>
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
      treeData: [{

        title: "parent 1",
        expand: true,
        children: [{
          title: "dassd",
          expand: true
        }, {
          title: "dassd",
          expand: true
        }, {
          title: "dassd",
          expand: true
        }, {
          title: "dassd",
          expand: true
        }]
      }]
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