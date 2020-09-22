<template>
  <div class="PlanStepSemantic">
    <SemanticTree :prefix="currentPrefix" />
    <SemanticList title="业务" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
  computed: {
    ...mapGetters([
      "currentPrefix"
    ])
  },
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