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

      ],
      isp: [{ required: true, message: "请选择网络运营商" }],
      ips: [
        { required: true, message: "请填写网络地址,换行分割" },

      ]

    };
    return {
      formModel: {

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
          placeholder: "请填写域名"
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
          model: "ipv4",
          type: "input",
          placeholder: "请填写备注"
        },
        {
          label: "IPv6",
          model: "ipv6",
          type: "input",
          placeholder: "请填写备注"
        },
        {
          label: "业务",
          model: "business",
          type: "input",
          placeholder: "请填写业务"
        },
        {
          label: "双栈访问",
          model: "supportdoublenetwork",
          type: "select",
          placeholder: "请填写双栈访问",
          children: [
            {
              label: "支持",
              text: "支持"
            }, {
              label: "不支持",
              text: "不支持"
            }]
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

      console.log(this.links)

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
      console.log(this.links)
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = { ...this.formModel };
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
          console.log(this.formModel, "fail")
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