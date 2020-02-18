<template>
  <div>
    <div class="login">
      <div class="login-head">
        <img class="logo" src="../assets/images/logo2.png" />
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
              <Icon type="ios-person-outline" slot="prepend"></Icon>
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
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Input
              size="large"
              type="text"
              name="captcha"
              v-model="captcha"
              placeholder="验证码"
              style="width:156px;"
              class="fl"
              @keyup.enter="login"
            />
            <div
              class="code-img clearfix fl"
              style="margin-left:5px;cursor: pointer;"
              @click="getCaptcha"
            >
              <img :src="img" class="fl code-captcha" />
              <p class="code-tips fl">看不清换一张</p>
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
        console.log(res.headers);
        // const headers = {}
        // res.headers.forEach((val, key) => {
        //   console.log(key + " -> " + val);
        // });
        this.checkvaluetoken = res.headers.get("checkvaluetoken");

        const reader = res.body.getReader();
        console.log(reader);
        const stream = new ReadableStream({
          start(controller) {
            async function push() {
              // "done"是一个布尔型，"value"是一个Unit8Array
              const arr = await reader.read();
              const blob = new Blob([arr.value]);
              const file = new FileReader();
              file.onload = function(e) {
                console.log(444, e, e.target.result);
                self.img = e.target.result;
              };
              file.readAsDataURL(blob);
            }
            push();
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
              // if (res.data !== "check value fail!") {
                services
                  .login(this.params)
                  .then(res => {
                    if (res.data.code === 200) {
                      this.$Message.success("Success!");
                      this.SET_TOKEN(res.data.token);
                      this.$router.push({ path: "/" });
                    }
                  })
                  .catch(res => {
                    this.$Message.error(res.response.data.message);
                  });
              // } else {
              //   this.$Message.error("图片验证失败");
              //   this.getCaptcha();
              // }
            });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 500px;
  margin: 180px auto;
  box-shadow: 0 0 10px #f5f5f5;
  .login-head {
    text-align: center;
  }

  .login-form {
    padding: 30px;
  }
  .code-captcha {
    height: 36px;
    width: 160px;
  }
  .code-tips {
    margin-left: 20px;
  }
}
</style>