<template>
  <common-modal
    class="view-modal"
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
        :show-fields="showFields"
      />

    </Form>
  </common-modal>
</template>

<script>
import { commonNameValidate } from "@/util/common";

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
        { required: true, message: "请填视图名称" },
        commonNameValidate,
        {
          pattern: /^.*[^\d].*$/,
          message: "名称不能为纯数字"
        }
      ],
      acls: [
        { required: true, message: "请选择ACL规则" }
      ]

    };

    return {
      formModel: {
        status: "allow",
        name: "",
        acls: [],
        dns64: "",
        comment: "",
        recursion: true
      },
      loading: false,
      dialogVisible: false,
      acl: []
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "视图";
    },
    isEdit() {
      const isEdit = !!this.links.update;
      return isEdit;
    },
    showFields() {
      const showFields = [];
      if (this.isEdit) {
        showFields.push("name");
        if (this.formModel.name === "default") {
          showFields.push("acls");
        }
      }
      return showFields;
    },
    formItemList() {
      const aclOptions = this.acl.map(item => {
        return {
          label: item.id,
          text: item.name
        };
      });

      const recursionFormItem = this.isEdit ? [] : [{
        label: "递归服务",
        model: "recursion",
        type: "bool-radio",
        children: [{
          value: true,
          label: "开启"
        }, {
          value: false,
          label: "关闭"
        }],
        placeholder: "请填选择是否口开启递归服务"
      }];

      return [
        {
          label: "视图名称",
          model: "name",
          type: "input",
          placeholder: "请填视图名称"
        },
        {
          label: "ACL规则",
          model: "acls",
          type: "select",
          multiple: true,
          placeholder: "请选择ACL规则",
          children: aclOptions
        },
        {
          label: "DNS64",
          model: "dns64",
          type: "input",
          placeholder: "请填写DNS64"
        },
        ...recursionFormItem,
        {
          label: "备注",
          model: "comment",
          type: "input",
          placeholder: "请填写备注信息"
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
        this.$get({ url: this.links.self }).then(({ name, dns64, acls, comment, priority, recursion }) => {
          this.formModel = {
            name,
            acls,
            comment,
            dns64,
            priority,
            recursion
          };
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    }

  },

  created() {
    this.$get({ url: "/apis/linkingthing.com/dns/v1/acls" }).then(({ data }) => {
      this.acl = data;
    });
  },

  methods: {

    handleConfirm(name) {
      this.$refs[name].validate(valid => {
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
            params.priority = 1;
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
      });
    }

  }
};
</script>

<style lang="less">
.view-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>