<template>
  <common-modal
    class="acl-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('formInline')"
    :loading="loading"
  >
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
import { commonNameValidate, isIp } from "@/util/common";
import { resStringToArray, resArrayToString } from "@/util/parser";
import ISPSelect from "./ISPSelect";
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
        { required: true, message: "请填访问控制名称" },
        commonNameValidate,
        {
          pattern: /^.*[^\d].*$/,
          message: "访问控制列表名称不能为纯数字"
        }
      ],
      ips: [
        { required: true, message: "请填写网络地址,逗号分割" },
        {
          validator: function (rule, value, callback) {
            const idValid = value.split(",").every(item => isIp(item.trim()));
            if (idValid) {
              callback();
            }
            if ("cmcc,cucc,ctcc".includes(value)) {
              callback();
            }
            callback("请正确填写网络地址");
          }
        }
      ]

    };
    return {
      formModel: {
        status: "allow",
        lineType: "isp",
        name: "",
        ips: "",
        comment: ""
      },
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "访问控制";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {

      let netAddress = {
        label: "网络地址",
        model: "ips",
        type: "input",
        placeholder: "请填写网络地址"
      }

      if (this.formModel.lineType === "isp") {
        netAddress = {
          label: "网络地址",
          model: "isp",
          placeholder: "请填写网络地址",
          type: "component",
          component: ISPSelect
        }
      }

      return [
        {
          label: "状态",
          model: "status",
          type: "radio",
          placeholder: "请填写前缀长度",
          children: [{
            label: "allow",
            text: "允许"
          },
          {
            label: "forbidden",
            text: "禁止"
          }]
        },
        {
          label: "规则名称",
          model: "name",
          type: "input",
          placeholder: "请填写规则名称"
        },
        {
          label: "线路类型",
          model: "lineType",
          type: "radio",
          placeholder: "请填写前缀长度",
          children: [{
            label: "isp",
            text: "运营商"
          },
          {
            label: "custom",
            text: "自定义"
          }]
        },
        netAddress,
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
        this.reset();
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, status, ips, comment, isp }) => {
          this.formModel = {
            name,
            ips,
            comment,
            status,
            isp,
            lineType: !!isp ? "isp" : "custom"
          };
          resArrayToString(this.formModel, ["ips"]);
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },

    "formModel.lineType"(val) {
      if (val === "custom") {
        this.formModel.isp = "";
      } else {
        this.formModel.ips = "";
      }
    }
  },

  created() {

  },

  methods: {
    reset() {
      this.$refs["formInline"].resetFields();
      this.formModel.status = "allow";
      this.formModel.lineType = "isp";
    },

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = { ...this.formModel };

          resStringToArray(params, ["ips"]);

          this.loading = true;
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
        } else {
          console.log(this.formModel)
        }
      });
    }

  }
};
</script>

<style lang="less">
.acl-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>