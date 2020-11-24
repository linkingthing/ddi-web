<template>
  <div class="semantics">
    <PlanStepSemantic />
  </div>
</template>

<script>
import PlanStepSemantic from "./modules/PlanStepSemantic";
import { mapGetters } from "vuex";

export default {
  components: {
    PlanStepSemantic
  },
  props: {},
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(["hasChange"])
  },
  created() { },
  mounted() { },
  methods: {},
  beforeRouteLeave(to, from, next) {


    if (this.hasChange) {
      this.$Message.info("请先保存再切换节点");
      next(false);
    } else {
      next();
    }
  }

};
</script>

<style lang="less" scoped>
.semantics {
  height: calc(100%);
  display: flex;
}
</style>