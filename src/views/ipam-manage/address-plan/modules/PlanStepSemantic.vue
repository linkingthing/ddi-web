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
    const { name, prefix } = this.$route.query;
    this.setPlanName(name);
    this.setPrefix(prefix);
    this.initTree();
  },
  methods: {
    ...mapMutations([
      "setPlanName",
      "setPrefix",
      "initTree"
    ])
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