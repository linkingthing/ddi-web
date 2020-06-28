<template>
  <div class="alarm-notice">
    <table-page
      :total="list.length"
      :data="executeList"
      :columns="columns"
      :current.sync="current"
      @on-selection-change="handleMutipleSelect"
    >
      <template slot="neck">
        <div>
          <SearchBar
            :params="initParams"
            @on-mutiple="handleMutipleDeal"
            @on-search="handleSearch"
          />
        </div>
      </template>
    </table-page>

  </div>
</template>

<script>
import SearchBar from "./modules/SearchBar";
import { alarmConfig, alarmLevel, alarmState } from "@/dictionary";

export default {
  components: {
    SearchBar
  },
  props: {},
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "告警项",
          key: "name",
          align: "left",
          width: "160",
          render: (h, { row }) => {
            return h("div", alarmConfig[row.name]);
          }
        },
        {
          title: "告警级别",
          key: "level",
          width: "130",
          align: "left",
          render: (h, { row }) => {
            return h("div", {
            }, alarmLevel[row.level]);
          }
        },
        {
          title: "告警信息",
          key: "name",
          align: "left",
          render: (h, { row }) => {
            // 百分比 布尔 整型
            if (row.haCmd) {
              if (row.haCmd === "master_up") {
                return h("div", `辅${row.slaveIp}切换到主${row.masterIp}`)
              }
              if (row.haCmd === "master_down") {
                return h("div", `主${row.masterIp}切换到辅${row.slaveIp}`);
              }
            }

            const thresholdText = row.thresholdType !== "trigger" && `超过${row.threshold} ${row.name.endsWith("Ratio") ? "%" : ""}`;
            return h("div", `节点${row.nodeIp} ${alarmConfig[row.name]} ${thresholdText}`);
          }
        },
        {
          title: "告警状态",
          key: "state",
          align: "left",
          width: "140",
          render: (h, { row }) => {
            return h("div", {

            }, alarmState[row.state]);
          }
        },
        {
          title: "时间",
          key: "creationTimestamp",
          align: "left",
          width: "220",
          render: (h, { row }) => {
            return h("div", this.$trimDate(row.creationTimestamp));
          }
        },
        {
          title: "操作",
          key: "action",
          align: "right",
          width: 200,
          render: (h, { row }) => {
            return h("div", {

            }, [
              h("i-button", {
                on: {
                  click: () => this.handleDeal(row, { state: "ignored" })
                },
                props: {
                  disabled: row.state !== "untreated",
                  size: "small",
                }

              }, "忽略"),
              h("Button", {
                on: {
                  click: () => this.handleDeal(row, { state: "solved" })
                },
                props: {
                  disabled: row.state !== "untreated",
                  size: "small",
                }

              }, "已处理")
            ]);
          }
        }
      ],
      list: [],
      mutipleList: [],
      initParams: {},
      current: 1
    };
  },
  computed: {
    executeList() {
      console.log(this.current)
      return this.list.map(item => {
        return {
          ...item,
          _disabled: item.state !== "untreated"
        };
      });
    }
  },

  created() {
    const { query } = this.$route;
    this.initParams = query;
    this.getData(query);
  },
  mounted() { },
  methods: {
    getData(params = this.initParams) {
      this.$getData(params).then(({ data }) => {
        this.loading = false;
        this.list = data;
      }).catch().finally(() => {
        this.loading = false;
      });

    },

    handleSearch(params) {
      this.current = 1;
      this.initParams = params;
      this.getData(params);
    },
    handleDeal({ links, ...params }, state) {
      this.$put({ url: links.update, params: { ...params, ...state } }).then(() => {
        this.$Message.success("操作成功");
        this.getData();
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    },
    handleMutipleSelect(select) {
      this.mutipleList = select.map(item => item.links);
    },
    handleMutipleDeal(state) {
      if (!this.mutipleList.length) {
        return;
      }
      // Promise all
      Promise.all(this.mutipleList.map(item => {
        return this.$put({ url: item.update, params: { ...item, ...state } });
      })).then(() => {
        this.$Message.success("批量操作成功");
        this.mutipleList = [];
        this.getData();
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      })

    }
  }
};
</script>

<style lang="less" scoped>
</style>