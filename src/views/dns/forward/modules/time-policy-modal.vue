<template>
  <common-modal
    class="zone-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="450"
    @confirm="handleConfirm('formInline')"
  >
    <IviewLoading v-if="loading" />
    <Form
      ref="formInline"
      label-position="left"
      :label-width="100"
      :label-colon="true"
      :rules="rules"
      :model="formModel"
    >

      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
        :show-fields="isEdit ? ['name'] : []"
      />

    </Form>
  </common-modal>
</template>

<script>

import TimeTypeDate from "./TimeTypeDate";
import TimeSelect from "./TimeSelect";

import TimeTypeWeek from "./TimeTypeWeek";
import { DateType } from "./helper";

import moment from "moment-timezone";
import { sortBy, isUndefined } from "lodash";


export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    links: {
      type: Object,
      default: () => ({})
    }
  },

  data() {

    this.rules = {
      name: [
        { required: true, message: "请填写组名称" }
      ],
      timetype: [{
        required: true, message: "请选时间方式"
      }],
      startTime: [
        {
          required: true,
          message: "请选择开始时间"
        },
        {
          validator: (rule, value, callback) => {
            const { timetype } = this.formModel;

            if (timetype !== DateType.Day) {
              const reg = /\d+-\d+/;
              if (reg.test(value)) {
                callback();
              } else {
                callback("请选择开始时间");
              }
            } else {
              callback();
            }
          }
        }
      ],
      endTime: [
        {
          required: true,
          message: "请选择结束时间"
        },
        {
          validator: (rules, value, callback) => {
            const { timetype, startTime } = this.formModel;
            const message = "结束时间应该大于开始时间";
            const policyMap = {
              [DateType.Day]: function () {
                return {
                  isValid: Number(value) <= Number(startTime),
                  message
                };
              },
              [DateType.Week]: function () {
                const [weekStart, timeStart] = String(startTime).split("-");
                const [weekEnd, timeEnd] = String(value).split("-");

                if (isUndefined(weekEnd) || isUndefined(timeEnd)) {
                  return {
                    isValid: true,
                    message: "请选择结束时间"
                  };
                }

                if (Number(weekEnd) < Number(weekStart)) {
                  return {
                    isValid: true,
                    message
                  };
                }
                if (Number(weekEnd) === Number(weekStart)) {
                  return {
                    isValid: Number(timeEnd) <= Number(timeStart),
                    message
                  };
                }
              },
              [DateType.Date]: function () {
                const [strampStart, timeStart] = String(startTime).split("-");
                const [strampEnd, timeEnd] = String(value).split("-");

                if (isUndefined(strampEnd) || isUndefined(timeEnd)) {
                  return {
                    isValid: true,
                    message: "请选择结束时间"
                  };
                }

                if (Number(strampEnd) < Number(strampStart)) {
                  return {
                    isValid: true,
                    message
                  };
                }

                if (Number(strampEnd) === Number(strampStart)) {
                  return {
                    isValid: Number(timeEnd) <= Number(timeStart),
                    message
                  };
                }

                if (Number(strampEnd) > Number(strampStart)) {
                  return {
                    isValid: false,
                    message
                  };
                }

              }

            };

            {
              const { isValid, message } = policyMap[timetype]();
              if (isValid) {
                callback(message);
              }
              callback();
            }

          }
        }
      ]

    };
    return {
      formModel: {
        timetype: DateType.Date,
        name: "",
        startTime: "",
        endTime: ""
      },
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "时间策略";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {

      let timeSegment = getTimeComponents(this.formModel.timetype);

      function getTimeComponents(type) {
        const timeTypeMap = {
          [DateType.Date]: {
            component: TimeTypeDate
          },
          [DateType.Week]: {
            component: TimeTypeWeek
          },
          [DateType.Day]: {
            component: TimeSelect
          }
        };

        function createComponent({ component }, params) {
          return {
            type: "component",
            component,
            props: {
              type: "date",
              format: "yyyy-MM-dd",
              style: "width: 100%",
              ...params
            }
          };
        }

        return [
          {
            label: "开始时间",
            model: "startTime",
            ...createComponent(timeTypeMap[type], { placeholder: "请选择开始时间" })
          },
          {
            label: "结束时间",
            model: "endTime",
            ...createComponent(timeTypeMap[type], { placeholder: "请选择结束时间" })
          }
        ];

      }


      return [
        {
          label: "名称",
          model: "name",
          type: "input",
          placeholder: "请填写名称"
        },
        {
          label: "时间",
          model: "timetype",
          type: "select",
          children: [{
            label: DateType.Date,
            text: "日期"
          }, {
            label: DateType.Week,
            text: "每周"
          }, {
            label: DateType.Day,
            text: "每日"
          }],
          placeholder: "请选择时间"
        },
        ...timeSegment,

        {
          label: "备注",
          model: "comment",
          type: "input",
          placeholder: "请填写备注"
        }
      ];
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        this.formModel = {
          timetype: DateType.Date,
          name: "",
          startTime: "",
          endTime: ""
        };
        this.$nextTick().then(() => {
          this.$refs.formInline.resetFields();
        });
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, timetype, comment, weekdaygroup, begindaytime, enddaytime }) => {

          const strategy = {
            [DateType.Date]: function () {
              const [startDate] = moment(begindaytime).format("YYYY-MM-DD HH:mm").split(" ");
              const [endDate] = moment(enddaytime).format("YYYY-MM-DD HH:mm").split(" ");
              let startTime = `${moment(startDate).valueOf()}-${moment(begindaytime).hour()}`;
              let endTime = `${moment(endDate).valueOf()}-${moment(enddaytime).hour()}`;
              return { startTime, endTime };
            },
            [DateType.Week]: function () {
              weekdaygroup = sortBy(weekdaygroup, function (o) {
                return o.weekday;
              });

              let startTime = `${weekdaygroup[0].weekday}-${weekdaygroup[0].beginminute / 60}`;
              let endTime = `${weekdaygroup[weekdaygroup.length - 1].weekday}-${weekdaygroup[weekdaygroup.length - 1].endminute / 60}`;

              return { startTime, endTime };
            },
            [DateType.Day]: function () {
              if (weekdaygroup.length) {
                const { beginminute, endminute } = weekdaygroup[0];
                let startTime = beginminute / 60;
                let endTime = endminute / 60;
                return { startTime, endTime };
              }
            }
          };

          let { startTime, endTime } = strategy[timetype]();
          this.formModel.timetype = timetype;
          this.$nextTick().then(() => {
            this.formModel.name = name;
            this.formModel.comment = comment;
            this.formModel.startTime = startTime;
            this.formModel.endTime = endTime;
          });

        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },

    "formModel.timetype"(val) {
      if (val === DateType.Date) {
        if (typeof this.formModel.startTime === "number") {
          this.formModel.startTime = "";
        }
        if (typeof this.formModel.endTime === "number") {
          this.formModel.endTime = "";
        }
      } else {
        if (typeof this.formModel.startTime !== "number") {
          this.formModel.startTime = undefined;
          this.formModel.endTime = undefined;
        }
      }
    }

  },

  created() {
  },

  methods: {

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = { ...this.formModel };

          const strategy = {
            [DateType.Date]: function (params) {
              const { startTime, endTime } = params;
              const [timestamp1, time1] = startTime.split("-");
              const [timestamp2, time2] = endTime.split("-");
              const oneMinute = 60 * 60 * 1000;
              params.begindaytime = moment.tz(new Date(+timestamp1 + time1 * oneMinute), "Asia/Shanghai").format();
              params.enddaytime = moment.tz(new Date(+timestamp2 + time2 * oneMinute), "Asia/Shanghai").format();
            },
            [DateType.Week]: function (params) {
              const { startTime, endTime } = params;
              const [week1, time1] = startTime.split("-");
              const [week2, time2] = endTime.split("-");

              if (Number(week1) < Number(week2)) {
                const startDay = {
                  beginminute: time1 * 60,
                  endminute: 24 * 60,
                  weekday: Number(week1)
                };
                const wholeDayGroup = Array.from({ length: Number(week2) - Number(week1) - 1 }, function wholeDay(item, index) {
                  return {
                    beginminute: 0,
                    endminute: 24 * 60,
                    weekday: Number(week1) + index + 1
                  };
                });
                const endDay = {
                  beginminute: 0,
                  endminute: time2 * 60,
                  weekday: Number(week2)
                };

                return [startDay, ...wholeDayGroup, endDay];
              }
              if (Number(week1) === Number(week2)) {
                return [{
                  beginminute: time1 * 60,
                  endminute: time2 * 60,
                  weekday: Number(week1)
                }];
              }

              //  "起始星期大于结束星期"; 在输入的时候预先做校验，这里的场景就永远不会出现

            },
            [DateType.Day]: function (params) {
              const { startTime, endTime } = params;
              return Array.from({ length: 1 }, function (item, index) {
                return {
                  beginminute: startTime * 60,
                  endminute: endTime * 60,
                  weekday: index
                };
              });
            }

          };
          const weekdaygroup = strategy[params.timetype](params);
          params.weekdaygroup = weekdaygroup;

          Reflect.deleteProperty(params, "startTime");
          Reflect.deleteProperty(params, "endTime");
          Reflect.deleteProperty(params, "type");

          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(res => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            });
          } else {
            this.$post({ url: this.links.self, params }).then(res => {
              this.$$success("新建成功");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            });
          }
        }
      });


    }

  }
};
</script>

<style lang="less">
.zone-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>