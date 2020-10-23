<template>
  <div class="plan">

    <div class="plan-content">

      <NoDataList
        :top="200"
        v-if="!planList.length && $store.getters.hasPermissionToCreate"
        button-text="新建规划"
        @add="handleAddPlan"
      />
      <!-- :buttons="[{
          text:'导入规划',
          event: handleImport
        }]" -->
      <table-page
        v-else
        :data="planList"
        :columns="columns"
        :total="0"
      >
        <template slot="top-right">

          <Button
            type="primary"
            @click="handleAddPlan"
            v-if="$store.getters.hasPermissionToCreate"
          >新建规划</Button>

        </template>
      </table-page>

    </div>

    <PlanModal
      :visible.sync="visible"
      :links="paramsLinks"
      @success="getPlanList"
    />

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

import SafeLock from "./modules/SafeLock";
import PlanModal from "./modules/PlanModal";

export default {
  components: {
    NoDataList,
    PlanTab,
    PlanProcess,

    PlanStepCreatePrefix,
    PlanStepSemantic,
    PlanStepTree,
    PlanStepAddressAssign,

    PlanModal

  },

  data() {
    return {
      visible: false,
      planList: [],
      columns: [{
        title: "IPv6前缀",
        key: "prefix",
        align: "left"
      },
      {
        title: "规划名称",
        key: "description",
        align: "left"
      },
      {
        title: "安全锁",
        key: "name",
        align: "left",
        render: (h, { row }) => {
          return h(SafeLock, {
            props: {
              isLock: !row.isLock,
              message: row.lockedby
            },
            nativeOn: {
              click: () => this.handleToggleLock(row, row.isLock)
            }
          });
        }
      },
      {
        title: "操作",
        key: "name",
        align: "right",
        render: (h, { row }) => {
          return h("div", [
            h("btn-line", {
              props: {
                title: "子网列表"
              }
            }),
            h("btn-line", {
              props: {
                title: "地图"
              }
            }),
            h("btn-line", {
              props: {
                title: "删除"
              }
            })
          ]);
        }
      }],
      url: this.$getApiByRoute().url,
      loading: true,
      netnodesurl: "",
      oneLayoutLinks: null,

      links: {},
      paramsLinks: {}


    };
  },

  computed: {
    ...mapGetters({
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
    this.getPlanList();
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

    getPlanList() {
      this.$get({ url: this.url }).then(({ data, links }) => {
        const tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);
          item.title = item.description;
          item.isLock = !!item.lockedby;
          return item;
        });
        this.planList = tableData;
        this.links = links;

      }).catch((err) => {
        this.$handleError(err);
      });
    },
    handleToggleLock({ links }, lock) {
      const action = lock ? "releaselock" : "requirelock";
      const url = `${links.self}?action=${action}`;
      this.$post({ url }).then(() => {
        this.$Message.success("操作成功");
        this.getPlanList();
      }).catch(err => {
        this.$Message.error(err.data.message);
      });
    },

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
      this.paramsLinks = this.links;
      this.visible = true;
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
}
.plan-content {
}
</style>