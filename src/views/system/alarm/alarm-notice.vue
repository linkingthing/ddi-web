<template>
  <div class="alarm-notice">
    <table-page
      :total="list.length"
      :data="executeList"
      :columns="columns"
      @on-selection-change="handleMutipleSelect"
    >
      <template slot="neck">
        <div>
          <SearchBar @on-mutiple="handleMutipleDeal" />
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
          render: (h, { row }) => {
            return h("div", alarmConfig[row.name]);
          }
        },
        {
          title: "告警级别",
          key: "level",
          align: "left",
          render: (h, { row }) => {
            return h("div", {
              style: {
                color: row.level === "critical" && "#FA8A40"
              }
            }, alarmLevel[row.level]);
          }
        },
        {
          title: "告警信息",
          key: "name",
          align: "left",
          render: (h, { row }) => {
            // 百分比 布尔 整型
            const offlineList = ["dhcpoffline",]
            const endResult = "";
            return h("div", `节点${row.nodeIp} ${alarmConfig[row.name]} 超过${row.threshold} ${row.name.endsWith("Ratio") ? "%" : ""}`);
          }
        },
        {
          title: "告警状态",
          key: "state",
          align: "left",
          render: (h, { row }) => {
            return h("div", {
              style: {
                color: row.state === "untreated" ? "#F74B4B" : (row.state === "ignored" ? "#999999" : "")
              }
            }, alarmState[row.state]);
          }
        },
        {
          title: "时间",
          key: "creationTimestamp",
          align: "left",
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
      mutipleList: []
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
  watch: {},
  created() {
    this.getData();
  },
  mounted() { },
  methods: {
    getData() {
      this.$getData().then(({ data }) => {
        this.loading = false;
        this.list = data;
      }).catch().finally(() => {
        this.loading = false;
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
      console.log(this.mutipleListLinks, state)
      // Promise all
      this.mutipleList.forEach(item => {
        this.$put({url: item.update, params: {...item, ...state}}).then()
      })
    }
  }
};
</script>

<style lang="less" scoped>
</style>