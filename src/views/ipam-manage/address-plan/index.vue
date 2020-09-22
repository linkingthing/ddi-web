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
      >新建规划</Button>
      <!-- <Button
        type="primary"
        @click="handleImport"
      >导入规划</Button> -->
    </div>
    <div class="plan-content">

      <NoDataList
        style="margin-top: 100px"
        v-if="!planList.length"
        button-text="新建规划"
        @add="handleAddPlan"
      />
      <!-- :buttons="[{
          text:'导入规划',
          event: handleImport
        }]" -->
      <template v-else>
        <PlanTab
          @onDeletePlan="handleDelete"
          :plan-list="planList"
        />
        <PlanProcess @onchange="handleProcessChange" />

        <component :is="stepComponent" />

      </template>

    </div>

  </div>
</template>

<script>

import { mapGetters, mapMutations } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";

import NoDataList from "@/components/NoDataList";
import PlanTab from "./modules/PlanTab";
import PlanProcess from "./modules/PlanProcess";
import PlanStepCreatePrefix from "./modules/PlanStepCreatePrefix";
import PlanStepSemantic from "./modules/PlanStepSemantic";
import PlanStepTree from "./modules/PlanStepTree";
import PlanStepAddressAssign from "./modules/PlanStepAddressAssign";
import { list2Tree } from "./modules/helper";

import eventBus from "@/util/bus";

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
      netnodesurl: "",
      oneLayoutLinks: null

    };
  },

  computed: {
    ...mapGetters({
      planList: "planList",
      currentPlan: "currentPlan",
      currentLayout: "currentLayout",
      stepComponent: "currentPlanProcessId",
      planProcessList: "planProcessList",
      netType: "netType"
    })
  },

  watch: {
    "currentPlan.links": {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.layouts) {
          this.getLayout(val);
        }
      }
    },
    "currentLayout": {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.links && val.links.netnodes) {
          this.getNetnodes(val.links);
        }
      }
    },
    currentPlanProcessId(val) {
      console.log(22, val)
    },
    netType(netType) {
      const params = {
        nettype: netType
      };
      this.$get({ url: this.netnodesurl, params }).then(({ data }) => {
        if (data[0]) {
          const netNodes = data[0].netitems;
          this.setNetnodes(netNodes);
        } else {
          this.setNetnodes([]);
        }
      }).catch((err) => {
        this.$Message.error(err.response.data.message);
      });
    }

  },

  mounted() {
    this.handleQuery();
    eventBus.$on("getLayout", this.getLayout)
  },


  methods: {
    ...mapMutations([
      "setPlanProcessListInit",
      "setPlanProcessListAccessible",
      "setCurrentPlanId",
      "setPlanList",
      "addPlan",
      "clearTempPlan",
      "setLayout",
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
          this.setPlanProcessListAccessible("PlanStepSemantic");

        }
      }).catch((err) => {
        this.$handleError(err);
      });

    },

    getLayout({ layouts } = this.currentPlan.links) {
      this.$get({ url: layouts }).then(({ data, links }) => {

        if (data.length) {
          const oneLinks = data[0].links;
          this.oneLayoutLinks = oneLinks;
          this.getLayoutOne(oneLinks);
        } else {
          this.oneLayoutLinks = null;
          this.setLayout({
            id: uuidv4(),
            planProcessAccessList: ["PlanStepSemantic"],
            name: "layout",
            nodes: null,
            links: {
              create: links.self
            },
            prefix: this.currentPlan.prefix
          });
        }

      });

    },

    getLayoutOne({ self }) {
      this.$get({ url: self }).then(data => {
        this.setLayout(data);
        this.setPlanProcessListAccessible("PlanStepSemantic");
        this.setPlanProcessListAccessible("PlanStepTree");

        if (Array.isArray(data.nodes) && data.nodes.length) {
          const id = data.nodes[0].id;
          this.setCurrentNodeId(id);
        }

        if (data.firstfinished) {
          this.setPlanProcessListAccessible("PlanStepAddressAssign");
        }
      });
    },

    getNetnodes: debounce(function ({ netnodes }) {
      const params = {
        nettype: this.netType
      };
      this.netnodesurl = netnodes;
      this.$get({ url: netnodes, params }).then(({ data }) => {
        let netNodes = [];
        if (data.length) {
          netNodes = data[0].netitems;
        }
        this.setNetnodes(netNodes);
      }).catch((err) => {
        this.setNetnodes([]);
      });
    }, 300),

    handleDelete(id) {
      this.$delete({ url: this.url + "/" + id }).then(() => {
        this.$$success("删除成功！");
        this.handleQuery();
      }).catch(() => {
        this.clearTempPlan();
      });

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
    handleProcessChange(process, isHandle) {
      if (isHandle) {
        const shouldRequestLayout = ["PlanStepSemantic", "PlanStepTree"].includes(process);
        if (shouldRequestLayout && this.oneLayoutLinks) {
          this.getLayoutOne(this.oneLayoutLinks);
        }
      }
    }
  }
};
</script>

<style lang="less">
.plan {
  padding-top: 60px;
  .top-right {
    position: absolute;
    right: 10px;
    top: 16px;
  }
}
.plan-content {
  padding: 24px;
  border-top: 1px solid #efefef;
}
</style>