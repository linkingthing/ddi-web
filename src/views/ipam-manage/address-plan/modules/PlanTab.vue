<template>
  <div class="PlanTab">
    <div class="PlanTabtitle">规划名称:</div>
    <ul>
      <!-- @mouseenter="handlerMouseEnter"
      @mouseout="handlerMouseOut" -->
      <PlanTabItem
        v-for="item in planList"
        v-bind="item"
        :key="item.id"
        :active="active"
        @click.native="handleTab(item)"
        @remove="handleRemoveTab"
      />
    </ul>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import PlanTabItem from "./PlanTabItem";
export default {
  components: {
    PlanTabItem
  },
  props: {
    planList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      active: 1
    };
  },
  computed: {
    ...mapGetters([
      "currentPlanId"
    ])
  },
  watch: {
    currentPlanId: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.active = val;
        }
      }
    }

  },
  created() { },
  mounted() { },
  methods: {
    ...mapMutations([
      "setCurrentPlanId",
      "setPlanList"
    ]),
    handleTab({ id }) {
      this.active = id;
      this.setCurrentPlanId(id);
    },
    handleRemoveTab(id) {
      this.$$confirm({ content: "您确定要删除当前数据吗？" }).then(() => {
        // this.exacuteDelete(id);
        this.$emit("onDeletePlan", id);
      });
    },
    exacuteDelete(id) {
      const planList = this.planList.filter(item => item.id !== id);
      this.setPlanList(planList);
      this.$nextTick().then(() => {
        if (id === this.active) {
          if (this.planList.length) {
            this.active = this.planList[0].id;
          } else {
            this.active = null;
          }
        }
      });
    },
    // handlerMouseEnter() {
    //   console.log(1)
    //   window.addEventListener("mousewheel", this.handleScroll, true);

    // },
    // handlerMouseOut() {
    //   console.log(2)
    //   window.removeEventListener("mousewheel", this.handleScroll, true);

    // },
    // handleScroll(e) {
    //   console.log(e)
    // }

  }
};
</script>

<style lang="less" scoped>
.PlanTab {
  display: flex;
  height: 40px;
  background: #f2f2f2;
  margin-bottom: 24px;
  border-radius: 4px;

  .PlanTabtitle {
    width: 100px;
    text-align: center;
    font-size: #333;
    font-size: 16px;
    background: #e6e6e6;
    line-height: 40px;
  }
  ul {
    flex: 1;
    display: inline-flex;
    overflow: auto;
    padding: 5px 5px 0;
  }
}
</style>