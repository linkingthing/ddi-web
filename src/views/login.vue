<template>
  <div class="login-content">
    <div class="login">
      <div class="login-head">
        <img
          class="header-logo"
          src="login-logo.png"
          alt="login-logo"
        >
      </div>
      <div>
        <Form
          ref="formLogin"
          :model="params"
          :rules="rules"
          class="login-form"
        >
          <FormItem
            prop="username"
            style="margin-bottom: 36px"
          >
            <img
              class="login-icon"
              src="../assets/images/login-icon-user.png"
              alt=""
            >

            <Input
              size="large"
              type="text"
              v-model="params.username"
              placeholder="请输入用户名称"
            />
            <span slot="prefix">http://</span>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <img
              class="login-icon"
              src="../assets/images/login-icon-password.png"
              alt=""
            >
            <Input
              size="large"
              type="password"
              v-model="params.password"
              @keyup.enter.native="login"
              placeholder="请输入用户密码"
            />

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
            @click="login"
            style="width: 230px;margin-top: 36px;background: #285DFF;opacity: 0.9;"
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
// eslint-disable-next-line no-unused-vars
 import JSEncrypt from 'jsencrypt/bin/jsencrypt.min.js'

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
            message: "请输入用户名称"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入用户密码"
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
          const params = { ...this.params };
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
  .ivu-input {
    padding-left: 40px;
  }
  .ivu-input-large {
    height: 50px;
  }
  .ivu-btn {
    background: #2d9fff;
    border-color: #2d9fff;
    height: 50px;
    line-height: 50px;

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
  background-image: url("../assets/images/login-bg.jpg");
  background-size: cover;
}
.login {
  width: 460px;
  position: absolute;
  right: 10%;
  top: 50%;
  margin-top: -170px;

  .login-head h1 {
    color: #59a2ec;
    font-size: 33px;
    text-align: center;
  }

  .header-logo {
    display: block;
    margin-bottom: 54px;
  }
  .login-icon {
    position: absolute;
    z-index: 10;
    top: 14px;
    left: 10px;
    width: 22px;
    height: 22px;
  }

  .header-text {
  }

  .login-form {
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