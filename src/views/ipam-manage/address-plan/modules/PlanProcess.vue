<template>
  <div class="PlanProcess">
    <ul>
      <li
        v-for="item in planProcessList"
        :key="item.icon"
      >
        <PlanProcessItem
          v-bind="item"
          @onchange="handleChange"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import PlanProcessItem from "./PlanProcessItem";
export default {
  components: {
    PlanProcessItem
  },
  props: {},
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      "currentLayout": state => {
        const { currentPlanId, planList } = state.plan;
        return planList.find(item => item.id === currentPlanId).layout;
      }
    }),
    ...mapGetters([
      "planProcessList"
    ])
  },
  watch: {
    "planProcessList": {
      immediate: true,
      deep: true,
      handler(val) {
        const planProcess = val.find(item => item.type === "active");
        if (planProcess) {
          const { id } = planProcess;
          this.$emit("onchange", id);
          this.setCurrentPlanProcessId(id);
        }
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "setCurrentPlanProcessId",
      "nextPlanStep"
    ]),
    handleChange(id) {
      this.nextPlanStep(id);
    }
  }
};
</script>

<style lang="less" scoped>
.PlanProcess {
  border-bottom: 1px dashed rgba(69, 134, 254, 0.3);
  margin-bottom: 40px;
  ul {
    display: inline-flex;
    padding-bottom: 30px;
  }
  li {
    flex: 1;
    position: relative;
    & + li {
      padding-left: 150px;
      &::before {
        position: absolute;
        width: 150px;
        left: 0;
        top: 40px;
        content: "";
        border-bottom: 1px dashed #ccc;
      }
    }
  }
}
</style>