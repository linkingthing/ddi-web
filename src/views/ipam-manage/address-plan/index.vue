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
        <!-- 
        <PlanStepSemantic />
        <PlanStepTree /> -->
        <PlanStepAddressAssign />
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
import { list2Tree } from "./modules/helper";

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
      stepComponent: "currentPlanProcessId",
      planProcessList: "planProcessList"
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
      "setPlanProcessListInit",
      "setCurrentPlanId",
      "setPlanList",
      "addPlan",
      "clearTempPlan",

      "setLayoutList",
      "setCurrentLayoutId",
      "setCurrentLayout",

      "setCurrentNodeId",

      "setNetnodes"
    ]),
    handleQuery() {

      this.$get({ url: this.url }).then(({ data }) => {
        const tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);
          item.title = item.description;
          return item;
        });

        this.setPlanList(tableData);

        if (tableData.length) {
          this.setCurrentPlanId(tableData[0].id);
        }
      }).catch((err) => {
        this.$handleError(err);
      });

    },

    getLayout({ layouts }) {
      this.$get({ url: layouts }).then(({ data, links }) => {

        this.setLayoutList(data);

        if (data.length) {
          const oneLinks = data[0].links;
          this.getLayoutOne(oneLinks);
        } else {
          this.setCurrentLayout({
            layout: {
              id: uuidv4(),
              planProcessAccessList: ["PlanStepSemantic"],
              name: "layout",
              nodes: null,
              links: {
                create: links.self
              }
            }, prefix: this.currentPlan.prefix
          });
          this.setPlanProcessListInit();
        }

      });

    },

    getLayoutOne({ self }) {
      this.$get({ url: self }).then(data => {
        this.setCurrentLayoutId(data.id);
        if (Array.isArray(data.nodes)) {
          data.nodes = list2Tree(data.nodes, "0");
        }
        this.setCurrentLayout({ layout: data, prefix: this.currentPlan.prefix });
        if (Array.isArray(data.nodes) && data.nodes.length) {
          const id = data.nodes[0].id;
          this.setCurrentNodeId(id);
        }

        this.getPlannedsubnets(data.links);
        this.getNetnodes(data.links);
      });
    },

    getPlannedsubnets({ plannedsubnets }) {
      this.$get({ url: plannedsubnets }).then(data => {
        console.log("plannedsubnets", data);
      })
    },

    getNetnodes({ netnodes }) {
      const params = {
        nettype: "netv6"
      }
      this.$get({ url: netnodes, params }).then(({ data }) => {
        console.log("netnodes", data);
        const netNodes = data[0].netitems;
        this.setNetnodes(netNodes);
      }).catch((err) => {
        console.dir(err)
      });
    },

    handleDelete(id) {
      this.$delete({ url: this.url + "/" + id }).then(() => {
        this.$$success("删除成功！");
        this.setPlanProcessListInit();
        this.currentNodeId("");
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
      this.setCurrentLayout(null);
      this.setPlanProcessListInit();

    },
    handleImport() {
      // 正式做导入功能之前，这个操作都用于测试store

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