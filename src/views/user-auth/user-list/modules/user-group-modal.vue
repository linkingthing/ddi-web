<template>
  <common-modal
    class="acl-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="750"
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
import MultipleSelect from "../../modules/MultipleSelect";
import ShowPassword from "@/components/BaseShowPassword";
import InputPassword from "@/components/BaseInputPassword";

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
    const self = this;
    this.rules = {
      username: [
        { required: true, message: "请填用户名称" }
      ],
      repassword: [
        {
          validator: function (rule, value, callback) {
            if (value === self.formModel.password) {
              callback();
            } else {
              callback("两次输入的密码不一致");
            }
          }
        }
      ]
    };

    return {
      formModel: {
        name: "",
        password: "",
        repassword: "",
        userGroupIDs: [],
        roleIDs: []
      },
      loading: false,
      dialogVisible: false,
      userGroup: [],
      roleList: [],
      isEditPassword: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "用户";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {


      let com = [{
        label: "登录密码",
        model: "password",
        type: "component",
        placeholder: "请输入密码",
        component: InputPassword,
        style: "width: 380px"

      },

      {
        label: "确认密码",
        model: "repassword",
        type: "component",
        placeholder: "请确认密码",
        component: InputPassword,
        style: "width: 380px"
      }];

      if (!this.isEditPassword && this.isEdit) {
        com = [{
          label: "登录密码",
          model: "password",
          type: "component",
          placeholder: "请输入密码",
          component: ShowPassword,
          style: "width: 380px",
          props: {
            click: () => this.isEditPassword = true
          }
        }

        ];
      }

      return [
        {
          label: "用户名称",
          model: "username",
          type: "input",
          placeholder: "请填写前缀长度",
          style: "width: 380px"
        },
        ...com,
        {
          label: "选择用户组",
          type: "component",
          model: "userGroupIDs",
          component: MultipleSelect,
          props: {
            dataList: this.userGroup
          }
        },
        {
          label: "选择角色",
          model: "roleIDs",
          type: "component",
          component: MultipleSelect,
          props: {
            height: 150,
            dataList: this.roleList
          }
        },
        {
          label: "备注",
          model: "comment",
          type: "textarea",
          placeholder: "请填写备注",
          autosize: { minRows: 5, maxRows: 5 },
          style: "width: 380px"
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
        this.$get({ url: this.links.self }).then(({ password, comment, username, userGroupIDs, roleIDs }) => {
          this.formModel = { password, comment, username, userGroupIDs, roleIDs, repassword: password || "" };

        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    }
  },

  created() {
    this.init();
  },

  methods: {

    init() {
      this.getUserGroup();
      this.getRoleList();
    },
    getUserGroup() {
      this.$getData({}, "/auth/auth/usergroups").then(({ data }) => {
        this.userGroup = data;
      });
    },
    getRoleList() {
      this.$getData({}, "/auth/auth/roles").then(({ data }) => {
        this.roleList = data;
      });
    },
    reset() {
      this.isEditPassword = false;
      this.$refs["formInline"].resetFields();
    },

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = { ...this.formModel };

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