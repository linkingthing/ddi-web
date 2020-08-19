<template>
  <div class="plan">
    <div
      style=""
      class="plan-content"
    >
      <PlanTab
        @onDeletePlan="handleDelete"
        @change="handlePlanChange"
        :plan-list="tableData"
        @currentPlan="currentPlan => currentPlan = currentPlan"
      />
      <PlanProcess @change="stepComponent => stepComponent = stepComponent" />

      <component :is="stepComponent" />
      <!-- <PlanStepCreatePrefix />
      <PlanStepSemantic />
      <PlanStepTree />
      <PlanStepAddressAssign /> -->
    </div>

  </div>
</template>

<script>
import PlanTab from "./modules/PlanTab";
import PlanProcess from "./modules/PlanProcess";
import PlanStepCreatePrefix from "./modules/PlanStepCreatePrefix";
import PlanStepSemantic from "./modules/PlanStepSemantic";
import PlanStepTree from "./modules/PlanStepTree";
import PlanStepAddressAssign from "./modules/PlanStepAddressAssign";

export default {
  components: {
    PlanTab,
    PlanProcess,
    PlanStepCreatePrefix,
    PlanStepSemantic,
    PlanStepTree,
    PlanStepAddressAssign
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      tableData: [],
      currentPlan: {},

      stepComponent: "PlanStepCreatePrefix"
    };
  },

  mounted() {
    this.handleQuery();
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      try {
        let { data } = await this.$get({ url: this.url });

        this.tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);
          item.title = item.description;
          return item;
        });
      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    },

    handleViewLayouts(data) {
      this.$router.push(`/address/ipam/plans/${data.id}/layouts?prefix=${data.prefix}&maskLen=${data.maskLen}`);
    },

    handleDelete(id) {

      this.$delete({ url: this.url + "/" + id }).then(() => {
        this.$$success("删除成功！");
        this.handleQuery();
      });

    },

    handlePlanChange(id) {
      console.log(id)
    }
  }
};
</script>

<style lang="less">
.plan {
  padding-top: 60px;
}
.plan-content {
  padding: 24px;
  border-top: 1px solid #efefef;
}
</style>