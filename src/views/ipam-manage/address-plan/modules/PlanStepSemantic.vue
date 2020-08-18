<template>
  <div class="PlanStepSemantic">
    <SemanticTree prefix="21/98:rt5623/::ee" />
    <SemanticList title="业务" />
  </div>
</template>

<script>
import SemanticTree from "./SemanticTree";
import SemanticList from "./SemanticList";
export default {
  components: {
    SemanticTree,
    SemanticList
  },
  props: {},
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
.PlanStepSemantic {
  display: flex;
}
</style>