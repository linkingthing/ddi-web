<template>
  <div class="content">
    <div class="login">
      <div class="login-head">
        <img class="logo" src="../assets/images/logo.png" />
        <h1>DDI配置管理平台</h1>
      </div>
      <div>
        <Form ref="formLogin" :model="params" :rules="rules" class="login-form">
          <FormItem prop="username">
            <Input
              size="large"
              type="text"
              v-model="params.username"
              @keyup.enter="login"
              placeholder="用户名称"
            >
              <img src="../assets/images/user.png" alt slot="prepend" />
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input
              size="large"
              type="password"
              v-model="params.password"
              @keyup.enter="login"
              placeholder="登录密码"
            >
              <img src="../assets/images/password.png" alt slot="prepend" />
            </Input>
          </FormItem>
          <FormItem>
            <Input
              size="large"
              type="text"
              name="captcha"
              v-model="captcha"
              placeholder="验证码"
              style="width:330px;"
              class="fl"
              @keyup.enter="login"
            />
            <div
              class="code-img clearfix fl"
              style="margin-left:5px;cursor: pointer;"
              @click="getCaptcha"
            >
              <img :src="img" class="fl code-captcha" />
              <!-- <p class="code-tips fl">看不清换一张</p> -->
            </div>
          </FormItem>
          <Button type="primary" long @click="login">登录</Button>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import services from "@/services";
import { mapMutations } from "vuex";

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
    this.getCaptcha();
  },
  methods: {
    ...mapMutations(["SET_TOKEN"]),
    getCaptcha() {
      const self = this;
      fetch("/dns/linkingthing.com/example/v1/getcheckimage.jpeg").then(res => {
        console.log(res.body);

        this.checkvaluetoken = res.headers.get("checkvaluetoken");

        const reader = res.body.getReader();
        console.log(reader);
        const imageArr = [];
        const stream = new ReadableStream({
          start(controller) {
            function push() {
              // "done"是一个布尔型，"value"是一个Unit8Array
              reader.read().then(({ done, value }) => {
                if (done) {
                  console.log("ok");
                  const blob = new Blob(imageArr);
                  const file = new FileReader();
                  file.onload = function(e) {
                    self.img = e.target.result;
                  };
                  file.readAsDataURL(blob);
                  return;
                }
                imageArr.push(value);
                push();
              });
            }
            push();
          },
          pull() {
            console.log("pull");
          }
        });
      });
    },
    login() {
      this.$refs["formLogin"].validate(valid => {
        if (valid) {
          services
            .verifyCaptcha({
              CheckValueToken: this.checkvaluetoken,
              CheckValue: this.captcha
            })
            .then(res => {
              if (res.data !== "check value fail!" || true) {
                services
                  .login(this.params)
                  .then(res => {
                    if (res.data.code === 200) {
                      this.$Message.success("Success!");
                      this.SET_TOKEN(res.data.token);
                      this.$router.push({
                        path: "/dns/accessControl/accessControlList"
                      });
                    }
                  })
                  .catch(res => {
                    this.$Message.error(res.response.data.message);
                  });
              } else {
                this.$Message.error("图片验证失败");
                this.getCaptcha();
              }
            });
        }
      });
    }
  }
};
</script>
<style lang="less">
.content {
  .ivu-input-group-large .ivu-input,
  .ivu-input-group-large > .ivu-input-group-prepend,
  .ivu-input-group-large > .ivu-input-group-append,
  .ivu-input {
    height: 70px;
    padding: 0 18px;
  }
  .ivu-btn {
    height: 70px;
    background: #2d9fff;
    border-color: #2d9fff;
    span {
      font-size: 30px;
    }
  }
}
</style>
<style lang="less" scoped>
.content {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/login-bg.png");
  background-size: cover;
}
.login {
  width: 700px;
  position: absolute;
  right: 60px;
  top: 200px;
  box-shadow: 0 0 10px #f5f5f5;

  .login-head h1 {
    color: #59a2ec;
    font-size: 40px;
    padding: 0 70px;
  }

  .login-form {
    padding: 70px;
  }
  .code-captcha {
    height: 70px;
    width: 200px;
    margin-left: 24px;
  }
  .code-tips {
    margin-left: 20px;
  }
}
</style>