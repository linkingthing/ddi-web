<template>
  <common-modal
    class="app-assets-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('formInline')"
    :loading="loading"
  >
    <Form
      ref="formInline"
      label-position="left"
      :label-width="90"
      :label-colon="true"
      :rules="rules"
      :model="formModel"
    >

      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
        :show-fields="isEdit ? ['appname'] : []"
      />

    </Form>
  </common-modal>
</template>

<script>
import MutilInput from "@/components/MutilInput";
import BoolRadio from "@/components/BoolRadio";
import { domainIsValid } from "@/util/common";

export default {
  components: {

  },
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
      appname: [
        { required: true, message: "请输入应用名称" }
      ],
      domain: [
        { required: true, message: "请输入域名" },
        {
          validator: (rule, value, callback) => {
            if (domainIsValid(value)) {
              callback();
            } else {
              callback("请正确输入域名");
            }
          }
        }
      ],
      apptype: [
        { required: true, message: "请选择服务模式" },
      ],
      supportdoublestack: [
        { required: true, message: "请选择是否双栈访问" },
      ],


    };
    return {
      formModel: {
        appname: "",
        domain: "",
        semantic: "",
        apptype: "",
        ipv4s: [],
        ipv6s: [],
        business: "",
        supportdoublestack: false,
        operatesupport: "",
        phonenumber: "",
        remark: "",
      },
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "应用资产";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {

      return [
        {
          label: "应用名称",
          model: "appname",
          type: "input",
          placeholder: "请填写应用名称",
        },
        {
          label: "域名",
          model: "domain",
          type: "input",
          placeholder: "请填写域名"
        },

        {
          label: "所属组织",
          model: "semantic",
          type: "input",
          placeholder: "请填写所属组织"
        },
        {
          label: "服务模式",
          model: "apptype",
          type: "select",
          clearabled: true,
          placeholder: "请选择服务模式",
          children: [{
            label: "单机",
            text: "单机"
          },
          {
            label: "热备",
            text: "热备"
          }, {
            label: "负载均衡",
            text: "负载均衡"
          }]
        },
        {
          label: "IPv4",
          model: "ipv4s",
          type: "component",
          component: MutilInput,
          props: {
            placeholder: "请填写IPv4",
          }
        },
        {
          label: "IPv6",
          model: "ipv6s",
          type: "component",
          component: MutilInput,
          props: {
            placeholder: "请填写IPv6",
          }
        },
        {
          label: "业务",
          model: "business",
          type: "input",
          placeholder: "请填写业务"
        },
        {
          label: "双栈访问",
          model: "supportdoublestack",
          type: "component",
          placeholder: "请填写双栈访问",
          component: BoolRadio,
          props: {
            children: [{
              value: true,
              label: "支持"
            }, {
              value: false,
              label: "不支持"
            }]
          }
        },
        {
          label: "运维人员",
          model: "operatesupport",
          type: "input",
          placeholder: "请填写运维人员"
        },
        {
          label: "联系方式",
          model: "phonenumber",
          type: "input",
          placeholder: "请填写联系方式"
        },
        {
          label: "备注",
          model: "remark",
          type: "input",
          placeholder: "请填写备注"
        },
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
        this.$get({ url: this.links.self }).then((res) => {
          this.formModel = {
            ...res
          };
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },

  },

  created() {

  },

  methods: {
    reset() {
      this.$refs["formInline"].resetFields();
    },

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = { ...this.formModel };
          this.loading = true;
          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(() => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
              this.loading = false;
            }).catch(err => {
              this.loading = false;
              this.$$error(err.response.data.message);
            });
          } else {
            this.$post({ url: this.links.self, params }).then(() => {
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
      });
    }

  }
};
</script>

<style lang="less">
.app-assets-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
  .ivu-modal-body {
    max-height: 700px;
    overflow: auto;
  }
}
</style>