<template>
  <div class="alarm-notice">
    <table-page
      :loading="loading"
      :total="total"
      :data="executeList"
      :columns="columns"
      :current.sync="query.current"
      @on-selection-change="handleMutipleSelect"
    >
      <template slot="neck">
        <div>
          <SearchBar
            :params="query"
            @on-mutiple="handleMutipleDeal"
            @on-search="handleSearch"
          />
        </div>
      </template>
    </table-page>

  </div>
</template>

<script>

import _ from "lodash";

import SearchBar from "./modules/SearchBar";
import { alarmConfig, alarmLevel, alarmState } from "@/dictionary";

export default {
  components: {
    SearchBar
  },
  props: {},
  data() {
    return {
      loading: false,
      columns: [
        {
          type: "selection",
          width: 60,
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

            if (row.name === "illegalDhcp") {
              return h(
                "div",
                `发现 ${alarmConfig[row.name]} IP: ${row.illegalDhcpIp} ${row.illegalDhcpMac && "MAC:"}  ${row.illegalDhcpMac}`
              )
            }

            if (row.name === "ipConflict") {
              return h("div", `${row.conflictIp} 冲突`);
            }

            if (row.name === "subnetConflict") {
              return h("div", `${row.conflictSubnet} 冲突`);
            }

            // 百分比 布尔 整型
            if (row.haCmd) {
              if (row.haCmd === "master_up") {
                return h("div", `${row.haRole.toLocaleUpperCase()}辅${row.slaveIp}切换到主${row.masterIp}`)
              }
              if (row.haCmd === "master_down") {
                return h("div", `${row.haRole.toLocaleUpperCase()}主${row.masterIp}切换到辅${row.slaveIp}`);
              }
            }
            let thresholdText = "";
            if (row.thresholdType !== "trigger") {
              thresholdText = `超过${row.threshold} ${row.name.endsWith("Ratio") ? "%" : ""}`;
            }

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
          width: 200,
          render: (h, { row }) => {
            return h("div", {

            }, [
              h("i-button", {
                style: {
                  marginRight: "10px"
                },
                on: {
                  click: () => this.handleDeal(row, { state: "ignored" })
                },
                props: {
                  disabled: row.state !== "untreated",
                  size: "small",
                  type: "primary",
                  ghost: true
                }

              }, "忽略"),
              h("Button", {

                on: {
                  click: () => this.handleDeal(row, { state: "solved" })
                },
                props: {
                  disabled: row.state !== "untreated",
                  size: "small",
                  type: "primary",
                  ghost: true
                }

              }, "已处理")
            ]);
          }
        }
      ],
      total: 0,
      list: [],
      mutipleList: [],
      query: { current: 1 }
    };
  },
  computed: {
    executeList() {
      return this.list.map(item => {
        return {
          ...item,
          _disabled: item.state !== "untreated"
        };
      });
    }

  },
  watch: {
    "$route.query": {
      deep: true,
      immediate: true,
      handler(value) {
        console.log(value)
        this.query = _.cloneDeep({
          ...value,
          current: +value.current || +value.page_num
        });
        this.getData();
      }
    }
  },

  created() {
    const { query } = this.$route;
    this.query = _.cloneDeep(query);
    if (query.current) {
      this.query.current = Number(query.current);
    }
  },
  mounted() { },
  methods: {
    getData(query = this.query) {
      const params = query;
      params.page_size = 10;
      params.page_num = query.current || 1;
      this.loading = true;
      this.$getData(params).then(({ data, pagination }) => {
        this.loading = false;
        this.list = data;
        this.total = pagination.total;
        if (data.length === 0) {
          this.query.current = pagination.pageNum;
        }
      }).catch((err) => {
        this.list = [];
        this.$Message.error(err.response.data.message);
      }).finally(() => {
        this.loading = false;
      });
    },

    handleSearch(query) {
      this.$router.replace({
        query: { ..._.cloneDeep(this.$route.query), ..._.cloneDeep(query) }
      });
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
        const { query } = this.$route;
        if (query.current && +query.current > 1) {
          this.$router.push({ query: { ...query, current: Number(query.current) - 1 } });
        } else {
          this.getData();
        }

      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });

    }
  }
};
</script>

<style lang="less" scoped>
</style>