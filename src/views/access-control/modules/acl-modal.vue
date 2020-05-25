<template>
  <common-modal
    class="acl-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
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
      />

    </Form>
  </common-modal>
</template>

<script>
import { commonNameValidate } from "@/util/common";
import { resStringToArray, resArrayToString } from "@/util/parser";

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
    this.formItemList = [
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
        label: "网络地址",
        model: "ips",
        type: "input",
        placeholder: "请填写网络地址"
      },
      {
        label: "备注",
        model: "comment",
        type: "input",
        placeholder: "请填写备注"
      }
    ];

    this.rules = {
      name: [
        { required: true, message: "请填访问控制名称" },
        commonNameValidate,
        {
          pattern: /^.*[^\d].*$/,
          message: "访问控制列表名称不能为纯数字"
        }
      ]

    };
    return {
      formModel: {
        status: "allow"
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
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        this.formModel = {};
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, status, ips, comment }) => {
          this.formModel = {
            name,
            ips,
            comment,
            status
          };
          resArrayToString(this.formModel, ["ips"]);
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    }
  },

  created() {

  },

  methods: {

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = { ...this.formModel };

          resStringToArray(params, ["ips"]);

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
.acl-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>