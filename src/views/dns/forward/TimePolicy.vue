<template>
  <div class="TimePolicy">
    <table-page
      title="转发视图"
      :data="list"
      :columns="columns"
      :total="list.length"
    >
      <template slot="top-right">
        <i-button
          type="primary"
          @click="handleOpenCreate"
          v-if="$store.getters.hasPermissionToCreate"
        >新建</i-button>
      </template>
    </table-page>
    <TimePolicyModal
      :links="paramsLinks"
      :visible.sync="visible"
      @success="getDataList"
    />
  </div>
</template>

<script>
import { sortBy } from "lodash";
import TimePolicyModal from "./modules/time-policy-modal";
import { DateType } from "./modules/helper";
const weekMap = {
  0: "星期日",
  1: "星期一",
  2: "星期二",
  3: "星期三",
  4: "星期四",
  5: "星期五",
  6: "星期六"
};

export default {
  name: "applicationFirewall",
  components: {
    TimePolicyModal
  },
  data() {
    return {
      columns: [
        {
          title: "名称",
          key: "name",
          align: "left",
          render: (h, { row }) => {
            return h(
              "a",
              {
                props: {
                  href: "javascript:;"
                }
              },
              row.name
            );
          }
        },
        {
          title: "开始时间",
          key: "startTime",
          align: "left"
        },
        {
          title: "结束时间",
          key: "endTime",
          align: "left"
        },
        {
          title: "备注",
          key: "comment",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "right",
          width: 160,
          render: (h, { row }) => {

            if (this.$store.getters.hasPermissionToCreate) {
              return h("div", [
                h("btn-edit", {
                  on: {
                    click: () => this.handleOpenEdit(row)
                  }
                }),
                h("btn-del", {
                  on: {
                    click: () => this.handleDelete(row)
                  }
                })
              ]);
            } else {
              return h("div");
            }
          }
        }
      ],
      list: [],
      links: {},
      paramsLinks: {},
      visible: false
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$getDataAndLinks().then(({ data, links }) => {
        this.list = data.map(item => {
          let startTime, endTime;

          let { weekdaygroup, timetype } = item;
          weekdaygroup = sortBy(weekdaygroup, function (o) {
            return o.weekday;
          });

          if (timetype === DateType.Day) {
            if (weekdaygroup.length) {
              const { beginminute, endminute } = weekdaygroup[0];
              startTime = `${beginminute / 60}:00`;
              endTime = `${endminute / 60}:00`;
            }
          }
          if (timetype === DateType.Week) {
            if (weekdaygroup.length) {
              {
                const { beginminute, weekday } = weekdaygroup[0];
                startTime = `${weekMap[weekday]} ${beginminute / 60}:00`;
              }
              {
                const { endminute, weekday } = weekdaygroup[weekdaygroup.length - 1];
                endTime = `${weekMap[weekday]} ${endminute / 60}:00`;
              }
            }
          }

          if (timetype === DateType.Date) {
            const { begindaytime, enddaytime } = item;
            startTime = this.$trimDate(begindaytime, "YYYY-MM-DD HH:mm");
            endTime = this.$trimDate(enddaytime, "YYYY-MM-DD HH:mm");
          }

          return {
            ...item,
            startTime,
            endTime
          };
        });
        this.links = links;
      });
    },
    handleOpenCreate() {
      this.visible = true;
      this.paramsLinks = this.links;
    },
    handleOpenEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    handleDelete({ links }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(() => {
            this.getDataList();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        }
      });
    }
  }
};
</script>

