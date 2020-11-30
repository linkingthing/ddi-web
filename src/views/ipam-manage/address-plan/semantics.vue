<template>
  <div class="semantics">
    <PlanStepSemantic />
  </div>
</template>

<script>
import PlanStepSemantic from "./modules/PlanStepSemantic";
import { mapGetters } from "vuex";

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
  methods: {},
  beforeRouteLeave(to, from, next) {


    if (this.hasChange) {
      // this.$Message.info("请先保存再切换节点");

      this.$Modal.confirm({
        title: "您想保存最新规划结果吗？",
        content: "<p>选择确定即使保存，选择取消即是取消改动</p>",
        loading: true,
        onOk: () => {

          eventBus.$emit("savePlan").then(() => {
            next(false);
          });

          this.$Modal.remove();

        },
        onCancel: () => {
          next();
        }
      });
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