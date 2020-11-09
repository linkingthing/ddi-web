<template>
  <div class="PlanStepSemantic">
    <SemanticTree prefix="语义树" />
    <SemanticContent />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import SemanticTree from "./SemanticTree";
import SemanticContent from "./SemanticContent";
export default {
  components: {
    SemanticTree,
    SemanticContent
  },
  props: {},
  data() {
    return {
    };
  },

  watch: {},
  created() { },
  mounted() {
    const { name, prefixs, } = this.$route.query;
    this.setPlanName(name);
    this.setPrefix(prefixs.split(","));


    this.getLayoutInfo();

  },
  destroyed() {
    console.log("reset resetLayoutData")
    this.resetLayoutData();
  },
  methods: {
    ...mapMutations([
      "setPlanName",
      "setPrefix",
      "initTree",
      "setNodes",
      "resetLayoutData"
    ]),
    getLayoutInfo() {
      this.$get(this.$getApiByRoute()).then(({ semanticnodes }) => {

        // set nextBitWidth,语义节点的父节点的属性值，来源于当前节点的plannode 的 bitwidth
        semanticnodes.forEach(node => {
          node.nextBitWidth = 0; // 默认为0,必须是数字，typeof node.nextBitWidth === "number"
          console.log(node)
          if (Array.isArray(node.plannodes) && node.plannodes.length) {
            const { bitWidth } = node.plannodes[0];
            node.nextBitWidth = bitWidth;
          }
        });

        // TODO： 语义节点初始设置prefix（返回数据中没有语义prefix，但是后面的若干操作设置value，选中axis都依赖prefix）


        //


        console.log(semanticnodes)
        this.setNodes(semanticnodes);
        // this.initTree();

      });
    }
  }
};
</script>

<style lang="less" scoped>
.PlanStepSemantic {
  display: flex;
  padding: 60px 20px 20px;
  flex: 1;
}
</style>