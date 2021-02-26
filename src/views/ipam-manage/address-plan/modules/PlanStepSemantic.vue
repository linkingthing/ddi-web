<template>
  <div class="PlanStepSemantic">

    <SemanticTree prefix="语义树" />
    <SemanticContent @updateTree="getLayoutInfo"/>

  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
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

  created() { },
  mounted() {
    this.getLayoutInfo();
  },
  beforeDestroy() {
    console.log(2, "beforeDestroy")

    this.setLoadingTree(true);
  },
  destroyed() {
    this.resetLayoutData();
  },

  methods: {
    ...mapMutations([
      "setPlanName",
      "setPrefixs",
      "initTree",
      "setNodes",
      "resetLayoutData",
      "setLoadingTree"
    ]),
    ...mapActions([
      "getCurrentPlanInfo"
    ]),
    getLayoutInfo() {
      this.getCurrentPlanInfo(this.$getApiByRoute());
    }
  }

};
</script>

<style lang="less" scoped>
.PlanStepSemantic {
  display: flex;
  padding: 76px 20px 0px;
  flex: 1;
  overflow: hidden;
  width: 100%;
}
</style>