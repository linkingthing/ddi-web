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
      "currentLayout": state => state.layout.currentLayout
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
        const { id } = val.find(item => item.type === "active");

        this.$emit("onchange", id);
        this.setCurrentPlanProcessId(id);
      }
    },
    "currentLayout": {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(val, this.planProcessList)
        if (val && val.id) {
          // 有layout的情况可以访问 第 二 三步骤
          // 构造出的isStructureLayout ，只能访问第二步
          const steps = ["PlanStepSemantic", "PlanStepTree"];
          const planProcessList = [];
          this.planProcessList.forEach(({ ...item }) => {
            console.log(item)
            if (val.planProcessAccessList) {
              if (val.planProcessAccessList.includes(item.id)) {
                item.type = "visited";
              }
            } else if (steps.includes(item.id)) {
              if (item.type === "") {
                item.type = "visited";
              }
            }
            planProcessList.push(item);
          });
          this.setPlanProcessList(planProcessList);
        }
      }
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "setCurrentPlanProcessId",
      "nextPlanStep",
      "setPlanProcessList"
    ]),
    handleChange(id) {
      this.nextPlanStep(id);
      this.$emit("onchange", id);
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