<template>
  <common-modal
    class="changepassowrd"
    :visible.sync="dialogVisible"
    title="修改密码"
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
            setTimeout(() => {
              self.$refs["formInline"].validateField("repassword");
            });
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
          this.$put({ url: `/apis/linkingthing.com/auth/v1/ddiusers/${username}`, params })
            .then(() => {
              this.$Message.success("修改成功");
              this.dialogVisible = false;
            });

        }
      });
    }

  }
};
</script>

<style lang="less">
</style>