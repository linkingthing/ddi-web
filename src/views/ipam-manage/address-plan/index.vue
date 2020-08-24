<template>
  <div class="plan">
    <div
      class="top-right"
      v-if="planList.length"
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
    <div class="plan-content">

      <NoDataList
        style="margin-top: 100px"
        v-if="!planList.length"
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
          :plan-list="planList"
          @currentPlan="currentPlan => currentPlan = currentPlan"
        />
        <PlanProcess />

        <component :is="stepComponent" />

        <PlanStepSemantic />
      </template>

    </div>

  </div>
</template>

<script>

import { mapGetters, mapMutations } from "vuex";
import { v4 as uuidv4 } from "uuid";

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
      loading: true

    };
  },

  computed: {
    ...mapGetters({
      planList: "planList",
      currentPlan: "currentPlan",
      stepComponent: "currentPlanProcessId"
    })
  },

  watch: {
    "currentPlan": {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.links) {
          this.getLayout(val.links);
        }
      }
    }

  },

  mounted() {
    this.handleQuery();
  },


  methods: {
    ...mapMutations([
      "setCurrentPlanId",
      "setPlanList",
      "addPlan",
      "clearTempPlan",

      "setLayoutList",
      "setCurrentLayoutId",
      "setCurrentLayout",

      "setCurrentNode"
    ]),
    async handleQuery() {
      this.loading = true;

      try {
        let { data } = await this.$get({ url: this.url });

        const tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);
          item.title = item.description;
          return item;
        });

        this.setPlanList(tableData);

        if (tableData.length) {
          this.setCurrentPlanId(tableData[0].id);
        }


      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    },

    getLayout({ layouts }) {
      this.$get({ url: layouts }).then(({ data }) => {


        this.setLayoutList(data);

        if (data.length) {
          this.setCurrentLayoutId(data[0].id);
          this.setCurrentLayout(data[0]);
          this.setCurrentNode(data[0]);
        }

      });

    },

    handleDelete(id) {

      this.$delete({ url: this.url + "/" + id }).then(() => {
        this.$$success("删除成功！");
        this.handleQuery();
      });

    },

    handlePlanChange(id) {
      // console.log(id)
    },
    handleAddPlan() {
      const id = uuidv4();
      this.addPlan({
        id,
        prefix: "",
        description: "New Plan",
        maxLen: 64,
        planType: "temp"
      });
      this.setCurrentPlanId(id);
    },
    handleImport() {
      // 正式做导入功能之前，这个操作都用于测试store
      // this.clearTempPlan("temp");

      console.log(this.$store)


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
.top-right {
  position: absolute;
  right: 10px;
  top: 16px;
}
</style>