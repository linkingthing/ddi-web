<template>
  <div class="semantics">
    <PlanStepSemantic />
  </div>
</template>

<script>
import PlanStepSemantic from "./modules/PlanStepSemantic";
import { mapGetters, mapMutations } from "vuex";

import eventBus from "@/util/bus";

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
  methods: {
    ...mapMutations(["setHasChange", "setLoadingTree", "setLoadingContent"])
  },
  beforeRouteLeave(to, from, next) {
    console.log(1, "beforeRouteLeave")
    // this.setLoadingContent(true);
    // this.setLoadingTree(true);
    if (this.hasChange) {
      this.$Modal.confirm({
        title: "您想保存最新规划结果吗？",
        content: "<p>选择确定即使保存，选择取消即是取消改动</p>",
        loading: true,
        onOk: () => {
          // eventBus.$emit("savePlan");
          this.$nextTick()
            .then(() => {
              this.setHasChange(false);
              this.$Modal.remove();
              next();
            });
        },
        onCancel: () => {
          this.setHasChange(false);
          next();
        }
      });
    } else {
      this.setHasChange(false);
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