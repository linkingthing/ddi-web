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
    const { name, prefixs, isCreate } = this.$route.query;
    this.setPlanName(name);
    this.setPrefix(prefixs.split(","));
    this.initTree();

    const shouldRequst = this.$route.query.isCreate === "false";
    if (shouldRequst) {
      this.getLayoutInfo();
    }

    console.log("mounted")
  },
  methods: {
    ...mapMutations([
      "setPlanName",
      "setPrefix",
      "initTree",
      "setNodes"
    ]),
    getLayoutInfo() {
      this.$get(this.$getApiByRoute()).then(({ nodes }) => {
        console.log(nodes)
        this.setNodes(nodes);
        this.initTree();

      })
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