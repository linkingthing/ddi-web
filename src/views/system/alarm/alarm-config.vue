<template>
  <div class="alarm-config">
    <table-page
      :total="total"
      :data="list"
      :columns="columns"
      :current.sync="current"
    />
  </div>
</template>

<script>
import { alarmConfig, alarmLevel } from "@/dictionary";

export default {
  props: {},
  data() {
    return {
      total: 0,
      current: 0,
      list: [],
      columns: [
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
          key: `level`,
          render: (h, { row }) => {
            return h("div", alarmLevel[row.level]);
          }
        },
        {
          title: "告警阈值",
          render: (h, { row }) => {

            return row.thresholdType !== "trigger" && h("line-edit",
              {
                on: {
                  "on-edit-finish": val => {
                    this.handleUpdateValue(row.links.update, val, row);
                  }
                },
                props: {
                  isPercent: row.name && row.name.endsWith("Ratio"),
                  value: row.value
                }
              }

            );
          }
        },
        {
          title: "告警通知",
          key: "action",
          width: 160,
          render: (h, { row }) => {
            return h("i-switch", {
              on: {
                "on-change": (val) => {
                  this.handleToggle(row.links.update, val, row);
                }
              },
              props: {
                size: "large",
                value: row.sendMail
              }
            }, [
              h("span", {
                slot: "open",

              }, "开启"),
              h("span", {
                slot: "close",

              }, "关闭")
            ]);
          }
        }
      ]
    };
  },
  computed: {},
  watch: {
    current: {
      handler() {
        this.getData();

      }
    }
  },

  mounted() { },
  methods: {
    getData() {
      const params = {
        page_size: 10,
        page_num: this.current
      };
      this.$getData(params).then(({ data, pagination }) => {
        this.loading = false;
        this.list = data;
        this.total = pagination.total;
        if (data.length === 0) {
          this.current = pagination.pageNum;
        }

      }).catch().finally(() => {
        this.loading = false;
      });

    },
    handleUpdateValue(url, value, row) {
      this.$put({ url, params: { ...row, value } }).then(() => {
        this.$Message.success("更新成功");
        this.getData();
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    },
    handleToggle(url, sendMail, row) {
      this.$put({ url, params: { ...row, sendMail } }).then(() => {
        this.$Message.success("更新成功");
        this.getData();
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>