<template>
  <div class="login-content">
    <div class="login">
      <div class="login-head">
        <h1>CLXOne®</h1>
      </div>
      <div>
        <Form
          ref="formLogin"
          :model="params"
          :rules="rules"
          class="login-form"
        >
          <FormItem prop="username">
            <Input
              size="large"
              type="text"
              v-model="params.username"
              @keyup.enter="login"
              placeholder="用户名称"
            />
            <img
              src="../assets/images/user.png"
              class="icon"
              alt
              slot="prepend"
            >
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input
              size="large"
              type="password"
              v-model="params.password"
              @keyup.enter.native="login"
              placeholder="登录密码"
            />
            <img
              src="../assets/images/password.png"
              class="icon"
              alt
              slot="prepend"
            >
            </Input>
          </FormItem>
          <!-- <FormItem>
            <Input
              size="large"
              type="text"
              name="captcha"
              v-model="captcha"
              placeholder="验证码"
              style="width:200px;"
              class="fl"
              @keyup.enter="login"
            />
            <div
              class="code-img clearfix fl"
              style="margin-left:5px;cursor: pointer;"
              @click="getCaptcha"
            >
              <img :src="img" class="fl code-captcha" >
            </div>
          </FormItem> -->
          <Button
            type="primary"
            long
            @click="login"
          >登录</Button>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import services from "@/services";
import { mapMutations } from "vuex";
import { resetRouter } from "@/router";
import JsEncrypt from "jsencrypt";

const publicKey = `-----BEGIN RSA Public Key-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK+W1jWdJh9S0WvOmv19ET6TRG2IdR5G
Vw5rKhcIZ4DQTRbsDXJ8/B5FNDrGIK5viPi7KZhi88lDAUwIDfrLzl8CAwEAAQ==
-----END RSA Public Key-----`;
// eslint-disable-next-line no-undef
const jse = new JSEncrypt();
jse.setPublicKey(publicKey);


export default {
  name: "login",

  data() {

    return {
      params: {
        username: "",
        password: ""
      },

      captcha: "",
      CheckValueToken: "",
      img: "",

      errTips: {
        userShow: false,
        passwordShow: false,
        codeShow: false
      },

      loading: false,
      rules: {
        username: [
          {
            required: true,
            message: "请输入输入用户名"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入输入密码"
          }
          // {
          //   type: "string",
          //   min: 6,
          //   message: "The password length cannot be less than 6 bits"
          // }
        ]
      }
    };
  },
  created() {
  },
  methods: {
    ...mapMutations(["SET_TOKEN", "SET_USERINFO", "setRoutes"]),

    login() {
      this.$refs["formLogin"].validate(valid => {
        if (valid) {
          const params = {...this.params};
          params.password = jse.encrypt(params.password);
          services
            .login(params)
            .then(res => {
              if (res.code === 200) {
                this.SET_USERINFO(false);
                this.setRoutes([]);
                resetRouter();
                this.$router.push({
                  path: "/"
                });
              }
            })
            .catch(err => {
              this.$Message.error(err.response.data.message);
            });
        }
      });
    }
  }
};
</script>
<style lang="less">
.login-content {
  .ivu-btn {
    background: #2d9fff;
    border-color: #2d9fff;
    height: 40px;
    line-height: 40px;

    span {
      font-size: 16px;
    }
  }
}
</style>
<style lang="less" scoped>
.login-content {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/login-bg.png");
  background-size: cover;
}
.login {
  width: 500px;
  position: absolute;
  right: 10%;
  top: 200px;
  box-shadow: 0 0 20px #f5f5f5;

  .login-head h1 {
    color: #59a2ec;
    font-size: 33px;
    padding: 20px 70px 0;
    text-align: center;
  }

  .header-text {
  }

  .login-form {
    padding: 30px 70px 50px;
    .icon {
      width: 20px;
    }
  }
  .code-captcha {
    height: 40px;
    width: 120px;
    margin-left: 24px;
  }
  .code-tips {
    margin-left: 20px;
  }
}
</style>