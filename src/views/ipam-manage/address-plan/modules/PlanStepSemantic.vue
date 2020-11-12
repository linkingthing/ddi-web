<template>
  <div class="PlanStepSemantic">
    <SemanticTree prefix="语义树" />
    <SemanticContent />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
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
    this.getLayoutInfo();
  },
  destroyed() {
    console.log("reset resetLayoutData")
    this.resetLayoutData();
  },
  methods: {
    ...mapMutations([
      "setPlanName",
      "setPrefixs",
      "initTree",
      "setNodes",
      "resetLayoutData"
    ]),
    ...mapActions([
      "getCurrentPlanInfo"
    ]),
    getLayoutInfo() {
      this.getCurrentPlanInfo(this.$getApiByRoute());
      // this.$get(this.$getApiByRoute()).then(({ name, prefixs, semanticnodes }) => {

      //   this.setPlanName(name);
      //   this.setPrefixs(prefixs);

      //   // set nextBitWidth,语义节点的父节点的属性值，来源于当前语义节点的子子语义子节点的 plannode 的 bitwidth
      //   semanticnodes.forEach(node => {
      //     node.nextBitWidth = 0; // 默认为0,必须是数字，typeof node.nextBitWidth === "number"

      //     const childSemanticNode = semanticnodes.find(item => item.parentsemanticid === node.id);
      //     if (childSemanticNode && Array.isArray(childSemanticNode.plannodes) && childSemanticNode.plannodes.length) {
      //       const { bitWidth } = childSemanticNode.plannodes[0];
      //       node.nextBitWidth = bitWidth;
      //     }
      //     node.plannodes = node.plannodes || [];
      //     // 从plannodes节点中将prefix捞出，用于聚焦树节点时候面板展示
      //     const prefixArr = node.plannodes.reduce((result, plannode) => {
      //       return result.concat(plannode.prefix);
      //     }, []);
      //     node.prefixs = prefixArr;

      //     node.addressCount = node.plannodes.length;


      //   });

      //   this.setNodes(semanticnodes);

      // });
    }
  }
};
</script>

<style lang="less" scoped>
.PlanStepSemantic {
  display: flex;
  padding: 60px 20px 0px;
  flex: 1;
}
</style>