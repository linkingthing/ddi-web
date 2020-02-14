<template>
  <div class="body">
    <div id="mian">
      <img class="logo" src="../assets/images/logo2.png" />
      <div id="loginForm">
        <input type="hidden" id="enPassword" name="enPassword" />
        <h1>DDI配置管理平台</h1>
        <ul>
          <li class="pr in-list">
            <Icon custom="i-icon i-icon-loginUser"></Icon>
            <input
              type="text"
              name="username"
              v-model="params.username"
              placeholder="用户名称"
              @keyup.enter="login"
              autofocus="autofocus"
            />
            <span class="err-tips" v-show="errTips.userShow">请输入用户名称</span>
          </li>
          <li class="pr in-list">
            <Icon custom="i-icon i-icon-loginPass"></Icon>
            <input
              type="password"
              name="password"
              v-model="params.password"
              placeholder="登录密码"
              @keyup.enter="login"
            />
            <span class="err-tips" v-show="errTips.passwordShow">请输入登录密码</span>
          </li>
          <li class="clearfix pr in-list">
            <Icon custom="i-icon i-icon-loginCode"></Icon>
            <input
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
              <img :src="img" class="fl code" />
              <p class="code-tips fl" style="margin-top:4px;margin-left:2px">
                <span class="db">看不清</span>
                <span class="db">换一张</span>
              </p>
            </div>
            <span class="err-tips fl" v-show="errTips.codeShow">请输入验证码</span>
          </li>
          <li>
            <span>
              <input type="checkbox" id="Check" class="Check" />
              <label for="Check"></label>
            </span>
          </li>
          <li style="margin-bottom: 0;">
            <Button type="primary" long @click="login">登录</Button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import services from "@/services";
import { isEmpty } from "../util/common";
import { mapMutations } from "vuex";

const Cache = require("../util/store").default("localStorage");

export default {
  name: "login",
  data() {
    return {
      params: {
        username: "",
        password: ""
      },

      captcha: "",

      img: "",

      errTips: {
        userShow: false,
        passwordShow: false,
        codeShow: false
      },

      loading: false
    };
  },
  mounted() {},
  methods: {
    ...mapMutations([
      'SET_TOKEN'
    ]),
    login(errTips) {
      services.login(this.params).then(res => {
        if (res.data.code === 200) {
          this.SET_TOKEN(res.data.token);
          this.$router.push({ path: "/" });
        }
      });
    },

    getCaptcha() {
      this.imgs = ""; // API.captcha +'?time='+Date.parse(new Date());
    }
  }
};
</script>

<style>
.code {
  height: 45px;
  width: 129px;
}
.err-tips {
  color: #ed4014;
  position: absolute !important;
  left: 0;
  bottom: -18px;
}
.pr {
  position: relative;
}
* {
  padding: 0;
  margin: 0;
}
li {
  list-style-type: none;
}

.body {
  background: url(../assets/images/loginbg.png) no-repeat;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  position: absolute;
  filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='bg-login.png', sizingMethod='scale');
}
#mian {
  padding: 10px 100px;
  clear: both;
  overflow: hidden;
  width: 600px;
  margin: auto;
  position: absolute;
  top: 50%;
  margin-top: -317px;
  left: 50%;
  margin-left: -300px;
}
#mian #loginForm {
  width: 400px;
  background: #fff;
  border-radius: 5px;
  -moz-box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}
#mian #loginForm h1 {
  line-height: 95px;
  position: relative;
  color: #294678;
  font-size: 24px;
  text-align: center;
}
#mian #loginForm h1:before {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  position: absolute;
  bottom: 0;
  background: #d7d7d7;
}
#mian #loginForm ul {
  padding: 40px 30px;
}
#mian #loginForm ul li {
  margin-bottom: 20px;
}
#mian #loginForm ul li input {
  width: 335px;
  line-height: 45px;
  outline: none;
  border-radius: 5px;
  font-size: 14px;
  padding: 0 30px;
  border: 1px solid #d7d7d7;
  height: 45px;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #fff inset;
}
#mian #loginForm ul li input[type="submit"] {
  color: #fff;
  font-size: 16px;
  /* background: @mainColor;
  border-color: @mainColor;
  cursor: pointer; */
}
#mian #loginForm ul li input::-webkit-input-placeholder {
  color: #999;
}
#mian #loginForm ul li input::-moz-placeholder {
  color: #999;
}
#mian #loginForm ul li input::-moz-placeholder {
  color: #999;
}
#mian #loginForm ul li input:-ms-input-placeholder {
  color: #999;
}
/*自定义复选框*/
#mian #loginForm ul li span {
  position: relative;
}
#mian #loginForm ul li .Check {
  visibility: hidden;
  position: absolute;
}
#mian #loginForm ul li .Check + label {
  cursor: pointer;
  margin: 0;
  border: 1px solid #d7d7d7;
  width: 12px;
  height: 12px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  line-height: 12px;
  border-radius: 2px;
}
#mian #loginForm ul li .Check:checked + label {
  background-color: #eee;
}
#mian #loginForm ul li .Check:checked + label:after {
  content: "\2714";
  display: block;
  width: 12px;
  height: 12px;
  position: relative;
  top: -13px;
  left: -1px;
}
#mian #loginForm ul li .Check + label:before {
  content: "记住密码";
  display: inline-block;
  color: #999;
  width: 50px;
  font-size: 12px;
  position: relative;
  left: 15px;
  top: -2px;
  cursor: pointer;
}
* {
  box-sizing: border-box;
}

.logo {
  display: block;
  margin: auto;
  margin-bottom: 30px;
}
</style>