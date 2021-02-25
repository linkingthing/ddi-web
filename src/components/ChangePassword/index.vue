<template>
  <common-modal
    class="changepassowrd"
    :visible.sync="dialogVisible"
    title="修改密码"
    :width="413"
    :loading="loading"
    @confirm="handleConfirm('formInline')"
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
      />
    </Form>
  </common-modal>
</template>

<script>
import InputPassword from "@/components/BaseInputPassword";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    username: {
      type: String,
      default: ""
    },

    action: {
      type: String,
      default: ""
    }
  },

  data() {

    const self = this;
    this.rules = {
      password: [{
        validator: function (rule, value, callback) {
          if (value.trim() && value.trim().length) {
            callback();
          } else {
            callback("请输入密码");
          }
        }
      }],
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

    this.formItemList = [{
      label: "用户名称",
      model: "username",
      type: "text"
    },

    {
      label: "登录密码",
      model: "password",
      type: "component",
      placeholder: "请输入密码",
      component: InputPassword
    },

    {
      label: "确认密码",
      model: "repassword",
      type: "component",
      placeholder: "请确认密码",
      component: InputPassword
    }];

    return {
      formModel: {
        username: "",
        password: "",
        repassword: ""
      },
      loading: false,
      dialogVisible: false
    };
  },

  watch: {
    visible(val) {
      if (!val) {
        this.reset();
        return;
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },

    username: {
      deep: true,
      immediate: true,
      handler(val) {
        this.formModel.username = val;
      }
    },
    "formModel.repassword"() {
      this.$refs["formInline"].validateField("repassword");
    }
  },

  created() {
  },

  methods: {
    reset() {
      this.$refs["formInline"].resetFields();
      this.formModel.username = this.username;
    },

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const { username, password } = this.formModel;

          const params = {
            username,
            password
          };
          this.loading = true;
          this.$post({ url: `/apis/linkingthing.com/auth/v1/users/${username}?action=${this.action}`, params })
            .then(() => {
              this.$Message.success("修改成功,将自动退出，请重新登陆");
              this.dialogVisible = false;
              setTimeout(() => {
                this.$router.push({
                  path: "/login"
                });
              }, 2000)

            }).finally(() => {
              this.loading = false;
            });
        }
      });
    }

  }
};
</script>

<style lang="less">
</style>