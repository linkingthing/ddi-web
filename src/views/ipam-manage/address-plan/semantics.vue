<template>
  <div class="semantics">
    <PlanStepSemantic />
  </div>
</template>

<script>
import PlanStepSemantic from "./modules/PlanStepSemantic";
export default {
  components: {
    PlanStepSemantic
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
.semantics {
  height: calc(100%);
  display: flex;
}
</style>