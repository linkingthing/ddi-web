<template>
  <div class="PlanStepTree">
    <PlanTree />
    <PlanTreeNodeModal />
  </div>
</template>

<script>
import PlanTree from "./PlanTree";
import PlanTreeNodeModal from "./PlanTreeNodeModal";
export default {
  components: {
    PlanTree,
    PlanTreeNodeModal
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
.PlanStepTree {
  display: flex;
}
</style>