<template>
  <div class="plan">
    <div
      class="top-right"
      v-if="tableData.length"
    >
      <Button
        type="primary"
        style="margin-right: 20px"
        @click="handleAddPlan"
      >手动添加规划</Button>
      <Button
        type="primary"
        @click="handleImport"
      >导入规划</Button>
    </div>
    <div
      style=""
      class="plan-content"
    >

      <NoDataList
        style="margin-top: 100px"
        v-if="!tableData.length"
        button-text="手动添加规划"
        @add="handleAddPlan"
        :buttons="[{
          text:'导入规划',
          event: handleImport
        }]"
      />
      <template v-else>
        <PlanTab
          @onDeletePlan="handleDelete"
          @change="handlePlanChange"
          :plan-list="tableData"
          @currentPlan="currentPlan => currentPlan = currentPlan"
        />
        <PlanProcess />

        <component :is="stepComponent" />
      </template>

    </div>

  </div>
</template>

<script>

import { mapGetters, mapMutations } from "vuex";

import NoDataList from "@/components/NoDataList";
import PlanTab from "./modules/PlanTab";
import PlanProcess from "./modules/PlanProcess";
import PlanStepCreatePrefix from "./modules/PlanStepCreatePrefix";
import PlanStepSemantic from "./modules/PlanStepSemantic";
import PlanStepTree from "./modules/PlanStepTree";
import PlanStepAddressAssign from "./modules/PlanStepAddressAssign";

export default {
  components: {
    NoDataList,
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

    };
  },

  computed: {
    ...mapGetters({
      stepComponent: "currentPlanProcessId"
    })
  },

  mounted() {
    this.handleQuery();
  },


  methods: {
    ...mapMutations([
      "setPlanList",
      "addPlan"
    ]),
    async handleQuery() {
      this.loading = true;

      try {
        let { data } = await this.$get({ url: this.url });

        this.tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);
          item.title = item.description;
          return item;
        });

        this.setPlanList(this.tableData);

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
    },
    handleAddPlan() {
      this.addPlan({
        prefix: "",
        description: "",
        maxLen: 64
      });
    },
    handleImport() { }


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
.top-right {
  position: absolute;
  right: 10px;
  top: 16px;
}
</style>