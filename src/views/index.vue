<template>
  <div id="index">
    <section>
      <!-- 头部 -->
      <iHeader></iHeader>
    </section>
    <!-- 路由 -->
    <router-view></router-view>

    <!-- footer -->
    <iFooter></iFooter>

    <!-- 修改密码 -->
    <modal
      v-model="changePassword"
      class-name="pop vertical-center-modal"
      :mask-closable="false"
      width="530"
      :closable="false"
    >
      <div slot="header">修改用户密码</div>
      <div>
        <i-form
          :model="dataConfig"
          label-position="right"
          :label-width="120"
          :rules="ruleValidate"
          ref="formValidate"
        >
          <div class="pop-content">
            <div class="pop-box">
              <p class="title">修改用户密码</p>
              <div class="pop-body">
                <Row>
                  <i-col span="24">
                    <form-item label="原密码" prop="oldPwd">
                      <i-input type="password" v-model="dataConfig.oldPwd" placeholder="请输入原密码"></i-input>
                    </form-item>
                  </i-col>
                  <i-col span="24">
                    <form-item label="新密码" prop="firstPwd">
                      <i-input type="password" v-model="dataConfig.firstPwd" placeholder="请输入新密码"></i-input>
                    </form-item>
                  </i-col>
                  <i-col span="24">
                    <form-item label="再次输入密码" prop="secondPwd">
                      <i-input type="password" v-model="dataConfig.secondPwd" placeholder="请再次输入密码"></i-input>
                    </form-item>
                  </i-col>
                </Row>
              </div>
            </div>
          </div>
        </i-form>
      </div>
      <div slot="footer">
        <i-button class="me-button k-btn" @click="cancelModel">取消</i-button>
        <i-button type="primary" class="me-button add-btn" v-if="!loading" @click="handleSubmit">应用</i-button>
        <i-button type="primary" class="me-button add-btn" :loading="loading" v-else>应用</i-button>
      </div>
    </modal>
  </div>
</template>

<script>
const Cache = require("../util/store").default("localStorage");
import iHeader from "./layout/Header";
import iFooter from "./layout/Footer";
import { isEmpty } from "../util/common";

export default {
  name: "index",
  components: {
    iHeader,
    iFooter
  },
  data() {
    const validator = (rule, value, callback) => {
      let _self = this;
      if (!isEmpty(value)) {
        callback(new Error("请再次输入密码"));
      } else if (_self.dataConfig.firstPwd !== _self.dataConfig.secondPwd) {
        callback(new Error("输入密码不一致"));
      } else {
        callback();
      }
    };
    const validator3 = (rule, value, callback) => {
      let _self = this;
      if (!isEmpty(value)) {
        callback(new Error("请输入新密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      changePassword: false,
      dataConfig: {
        oldPwd: "",
        firstPwd: "",
        secondPwd: ""
      },
      modulus: "",
      exponent: "",
      loading: false,
      ruleValidate: {
        oldPwd: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        firstPwd: [{ required: true, validator: validator3, trigger: "blur" }],
        secondPwd: [{ required: true, validator: validator, trigger: "blur" }]
      }
    };
  },
  methods: {
    //关闭弹窗
    cancelModel() {
      this.changePassword = false;
      this.$refs.formValidate.resetFields();
    },
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.individualUpdate_pwd();
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
</style>