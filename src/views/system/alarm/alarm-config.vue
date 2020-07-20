<template>
  <div class="alarm-config">
    <table-page
      :total="list.length"
      :data="list"
      :columns="columns"
    />
  </div>
</template>

<script>
import { alarmConfig, alarmLevel } from "@/dictionary";

export default {
  props: {},
  data() {
    return {
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
          align: "center",
          render: (h, { row }) => {
            return h("div", alarmLevel[row.level]);
          }
        },
        {
          title: "告警阈值",
          align: "right",
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
          align: "right",
          width: 160,
          render: (h, { row }) => {
            return h("i-switch", {
              on: {
                "on-change": (val) => {
                  this.handleToggle(row.links.update, val, row)
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
  watch: {},
  created() {
    this.getData();
  },
  mounted() { },
  methods: {
    getData() {
      this.$getData().then(({ data }) => {
        console.log(data)
        this.loading = false;
        this.list = data;
      }).catch().finally(() => {
        this.loading = false;
      });

    },
    handleUpdateValue(url, value, row) {
      this.$put({ url, params: { ...row, value } }).then(() => {
        this.$Message.success("更新成功");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    },
    handleToggle(url, sendMail, row) {
      this.$put({ url, params: { ...row, sendMail } }).then(() => {
        this.$Message.success("更新成功");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>