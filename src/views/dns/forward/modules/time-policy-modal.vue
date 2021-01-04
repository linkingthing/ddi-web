<template>
  <common-modal
    class="zone-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="450"
    @confirm="handleConfirm('formInline')"
    :loading="loading"
  >
    <Form
      ref="formInline"
      label-position="left"
      :label-width="100"
      :label-colon="true"
      :model="formModel"
      :rules="rules"
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

import moment from "moment";
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
      timeType: [{
        required: true, message: "请选时间方式"
      }],
      startTime: [
        {
          required: true,
          message: "请选择开始时间"
        },
        {
          validator: (rule, value, callback) => {
            const { timeType } = this.formModel;

            if (timeType !== DateType.Day) {
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
            const { timeType, startTime } = this.formModel;
            const message = "结束时间应该大于开始时间";

            const policyMap = {
              [DateType.Day]: function () {

                const [hours, seconds] = value.split(":").map(Number);
                const [shours, sseconds] = startTime.split(":").map(Number);

                if (shours === hours) {
                  return {
                    isValid: Number(seconds) <= Number(sseconds),
                    message
                  };
                }

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


                if (Number(weekEnd) === Number(weekStart)) {
                  const [hours, seconds] = timeEnd.split(":").map(Number);
                  const [shours, sseconds] = timeStart.split(":").map(Number);

                  if (shours > hours) {
                    return {
                      isValid: true,
                      message
                    };
                  }
                  if (shours === hours) {

                    return {
                      isValid: Number(seconds) <= Number(sseconds),
                      message
                    };
                  }
                }
                callback();
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

                  const [hours, seconds] = timeEnd.split(":").map(Number);
                  const [shours, sseconds] = timeStart.split(":").map(Number);

                  if (shours === hours) {
                    return {
                      isValid: Number(seconds) <= Number(sseconds),
                      message
                    };
                  }

                  if (shours > hours) {
                    return {
                      isValid: true,
                      message
                    };
                  }

                }



              }

            };

            {

              const { isValid, message } = policyMap[timeType]();
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
        timeType: DateType.Date,
        name: "",
        startTime: "",
        endTime: "",
        comment: ""
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

      let timeSegment = getTimeComponents(this.formModel.timeType);

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
          model: "timeType",
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
          timeType: DateType.Date,
          name: "",
          startTime: "",
          endTime: "",
          comment: ""
        };
        this.$nextTick().then(() => {
          this.$refs.formInline.resetFields();
        });
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, timeType, comment, timePeriods }) => {
          let timePeriod = {};
          if (Array.isArray(timePeriods) && timePeriods.length) {
            timePeriod = timePeriods[0];
          }
          const strategy = {
            [DateType.Date]: function () {

              const { beginTime, endTime } = timePeriod;
              const [year, month, date, time] = beginTime.split(" ");
              const [year1, month1, date1, time1] = endTime.split(" ");

              return {
                startTime: moment(`${year}-${month}-${date}`).valueOf() + "-" + time,
                endTime: moment(`${year1}-${month1}-${date1}`).valueOf() + "-" + time1
              };
            },
            [DateType.Week]: function () {

              const { beginTime, endTime } = timePeriod;
              const [week, time] = beginTime.split(" ");
              const [week1, time1] = endTime.split(" ");

              return {
                startTime: `${week}-${time}`,
                endTime: `${week1}-${time1}`
              };
            },
            [DateType.Day]: function () {
              const { beginTime, endTime } = timePeriod;

              return {
                startTime: beginTime,
                endTime: endTime
              };

            }
          };

          let { startTime, endTime } = strategy[timeType]();

          this.formModel.timeType = timeType;
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

    "formModel.timeType"(val) {
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
      this.$refs[name].validate().then((valid) => {
        if (valid) {
          this.submit();
        }
      });
    },

    formatTime(timestamp, time) {
      return `${moment(+timestamp).format("YYYY MM DD")} ${time}`;
    },
    submit() {
      this.loading = true;
      const params = { ...this.formModel };
      const strategy = {
        [DateType.Date]: (params) => {
          const { startTime, endTime } = params;
          const [timestamp1, time1] = startTime.split("-");
          const [timestamp2, time2] = endTime.split("-");

          const timePeriod = {
            beginTime: this.formatTime(timestamp1, time1),
            endTime: this.formatTime(timestamp2, time2)
          };

          params.timePeriods = [timePeriod];

        },
        [DateType.Week]: function (params) {
          const { startTime, endTime } = params;

          const timePeriod = {
            beginTime: startTime.split("-").join(" "),
            endTime: endTime.split("-").join(" ")
          };

          params.timePeriods = [timePeriod];

        },
        [DateType.Day]: function (params) {
          const { startTime, endTime } = params;
          const timePeriod = {
            beginTime: startTime,
            endTime
          };
          params.timePeriods = [timePeriod];
        }

      };
      strategy[params.timeType](params);

      Reflect.deleteProperty(params, "startTime");
      Reflect.deleteProperty(params, "endTime");
      Reflect.deleteProperty(params, "type");

      if (this.isEdit) {
        this.$put({ url: this.links.update, params }).then(res => {
          this.$$success("编辑成功");
          this.$emit("success");
          this.dialogVisible = false;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$$error(err.response.data.message);
        });
      } else {
        this.$post({ url: this.links.self, params }).then(res => {
          this.$$success("新建成功");
          this.$emit("success");
          this.dialogVisible = false;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$$error(err.response.data.message);
        });
      }

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