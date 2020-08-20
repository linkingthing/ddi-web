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
import { mapGetters, mapMutations } from "vuex";
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
    }
  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "setCurrentPlanProcessId"
    ]),
    handleChange(id) {
      this.planProcessList.forEach(item => {
        if (item.id === id) {
          item.type = "active";
        } else if (item.type === "active") {
          item.type = "visited";
        }
      });
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