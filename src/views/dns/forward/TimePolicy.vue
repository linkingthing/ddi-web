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
          v-if="$hasPermissionCreate('forwardtimepolicy')"
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
          align: "left"
        },
        {
          title: "开始时间",
          key: "beginTime",
          align: "left"
        },
        {
          title: "结束时间",
          key: "endTime",
          align: "left"
        },
        {
          title: "备注",
          key: "comment"
        },
        {
          title: "操作",
          key: "action",
          width: 160,
          render: (h, { row }) => {

            if (this.$hasPermissionCreate("forwardtimepolicy")) {
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
      this.$get(this.$getApiByRoute()).then(({ data, links }) => {
        this.list = Array.isArray(data) ? data.map(item => {
          let { timePeriods } = item;
          let { beginTime, endTime } = timePeriods[0];
          if (DateType.Date === item.timeType) {
            const [year, mouth, day, time] = beginTime.split(" ");
            const [year1, mouth1, day1, time1] = endTime.split(" ");
            return {
              ...item,
              beginTime: `${year}-${mouth}-${day} ${time}`,
              endTime: `${year1}-${mouth1}-${day1} ${time1}`
            };
          }

          if (DateType.Week === item.timeType) {
            const [week, time] = beginTime.split(" ");
            const [week1, time1] = endTime.split(" ");

            return {
              ...item,
              beginTime: `${weekMap[week]} ${time}`,
              endTime: `${weekMap[week1]} ${time1}`
            };
          }

          if (DateType.Day === item.timeType) {
            return {
              ...item,
              beginTime,
              endTime
            };
          }

        }) : [];
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

