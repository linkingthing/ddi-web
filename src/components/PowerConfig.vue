<template>
  <modal
    v-model="powerModal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">修改A4合成地址列表</div>
    <div>
      <vue-scroll style="height: 500px;" ref="vs">
        <i-form
          :model="upgradeConfig"
          label-position="right"
          :label-width="500"
          :rules="ruleValidate"
          ref="formValidate"
        >
          <div class="pop-content">
            <div class="pop-box">
              <!-- <p class="title">应用域名</p> -->
              <div class="pop-body" style="padding-bottom:0">
                <form-item label="前缀" :label-width="110" prop="t1">
                  <i-input v-model="upgradeConfig.t1" placeholder="请填写资源名称"></i-input>
                </form-item>
                <form-item label="客户IP白名单" prop="t2" :label-width="110">
                  <i-select v-model="upgradeConfig.t2">
                    <i-option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</i-option>
                  </i-select>
                </form-item>
                <form-item label="客户IP黑名单" prop="t3" :label-width="110">
                  <i-select v-model="upgradeConfig.t3">
                    <i-option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</i-option>
                  </i-select>
                </form-item>
                <form-item label="目标IPv4地址" prop="t4" :label-width="110">
                  <i-select v-model="upgradeConfig.t4">
                    <i-option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</i-option>
                  </i-select>
                </form-item>
              </div>
            </div>
          </div>
        </i-form>
      </vue-scroll>
    </div>
    <div slot="footer">
      <i-button class="me-button k-btn" @click="powerModal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import axios from "axios";
import { isURL, isIPv4, isIPv6, isEmpty } from "../util/common";
import services from "@/services";

export default {
  name: "RestrictWebsiteVisitsConfig",
  data() {
    // 校验域名/IP
    const validateDmainIp = (rule, value, callback) => {
      if (!isEmpty(value)) {
        callback("请输入记录值");
      } else {
        if (!isURL(value)) {
          callback(new Error("请正确输入记录值"));
        } else {
          callback();
        }
      }
    };

    const validateDmainIp4 = (rule, value, callback) => {
      if (!Number.isInteger(+value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };

    return {
      // 是否显示mode
      powerModal: false,
      list: [],
      dns64s: "",
      // 表单数据
      upgradeConfig: {
        title: "",
        t1: "",
        t2: "",
        t3: "",
        t4: ""
      },
      self: "",
      id: "",
      fileSSL: null,
      fileSSL2: null,
      // 表单验证规则
      ruleValidate: {
        t1: [
          { required: true, message: "请填正确的地址前缀", trigger: "change" }
        ],
        t2: [{ message: "请选择客户IP白名单", trigger: "change" }],
        t3: [{ message: "请选择客户IP黑名单", trigger: "change" }],
        t4: [{ message: "请选择目标IPv4地址", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.getChoose();
  },
  methods: {
    openConfig(dns64s, b) {
      this.id = b;
      this.dns64s = dns64s;
      this.powerModal = true;
      setTimeout(() => {
        this.$refs["vs"].scrollTo(
          {
            y: "0"
          },
          0
        );
      }, 0);
    },
    getChoose() {
      services
        .getAccessList()
        .then(res => {
          this.list = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    update() {
      this.$axios
        .put("http://10.0.0.19:8081" + this.dns64s + "/" + this.id, {
          prefix: this.upgradeConfig.t1,
          clientwhite: this.upgradeConfig.t2,
          clientblack: this.upgradeConfig.t3,
          aaddress: this.upgradeConfig.t4
        })
        services.updateDNS64()
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 应用
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.update();
          this.$Message.success("修改成功!");
        } else {
          this.$Message.error("修改失败");
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
