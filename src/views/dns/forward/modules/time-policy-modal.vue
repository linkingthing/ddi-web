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
import {
  ipv4IsValid,
  ipv6IsValid
} from "@/util/common";

import { DatePicker } from "view-design";
import WeekSelect from "./WeekSelect";
import TimeSelect from "./TimeSelect";

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
      ips: [
        { required: true, message: "请填写组名称" },
        {
          validator: (rule, value, callback) => {
            if (value.trim() === "") {
              callback("请输入服务器地址");
            }
            const ipList = value.split(",");
            const isPass = ipList.every(item => {
              return (ipv4IsValid(item.trim()) || ipv6IsValid(item.trim())) && !item.includes("/");
            });

            if (ipList.length > 10) {
              callback(new Error("每次最多填写10条"));
            }

            if (isPass) {
              callback();
            } else {
              callback(new Error("请正确填写服务器地址"));
            }


          }
        }
      ]
    };
    return {
      formModel: {
        timeType: "1",
        ips: "",
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

      let timeSegment = getTimeComponents(this.formModel.timeType);

      function getTimeComponents(timeType) {
        const timeTypeMap = {
          "1": {
            component: DatePicker
          },
          "2": {
            component: WeekSelect
          },
          "3": {
            component: TimeSelect
          }
        };

        function createComponent({ component }, params) {
          return {
            type: "component",
            component,
            props: {
              type: "datetime",
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
            type: "textarea",
            placeholder: "请选择开始时间",
            ...createComponent(timeTypeMap[timeType], { placeholder: "请选择开始时间1" })
          },
          {
            label: "结束时间",
            model: "endTime",
            type: "textarea",
            placeholder: "请选择结束时间"
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
            label: "1",
            text: "日期"
          }, {
            label: "2",
            text: "每周"
          }, {
            label: "3",
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
        this.$refs.formInline.resetFields();
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, ips, comment }) => {
          this.formModel = {
            name,
            ips: ips.join(","),
            comment
          };
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },

    "formModel.timeType"(val) {
      if (val === "1") {
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

          if (typeof params.ips === "string") {
            if (params.ips.trim().length) {
              params.ips = params.ips.split(",").map(item => item.trim());
            } else {
              params.ips = [];
            }
          } else {
            params.ips = [];
          }

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