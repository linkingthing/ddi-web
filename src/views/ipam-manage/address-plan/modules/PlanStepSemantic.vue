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