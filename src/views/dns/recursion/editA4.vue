<template>
  <common-modal
    :visible.sync="powerModal"
    title="修改A4合成地址列表"
    @confirm="handleSubmit"
  >
    <i-form
      :model="params"
      label-position="right"
      :label-width="500"
      :rules="ruleValidate"
      ref="formValidate"
    >
      <div class="pop-content">
        <div class="pop-box">
          <div
            class="pop-body"
            style="padding-bottom:0"
          >
            <form-item
              label="前缀"
              :label-width="110"
              prop="prefix"
            >
              <i-input
                v-model="params.prefix"
                placeholder="请填写前缀"
              ></i-input>
            </form-item>
            <form-item
              label="客户IP地址"
              prop="clientacl"
              :label-width="110"
            >
              <i-select v-model="params.clientacl">
                <i-option
                  v-for="item in list"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</i-option>
              </i-select>
            </form-item>

            <form-item
              label="目标IPv4地址"
              prop="aaddress"
              :label-width="110"
            >
              <i-select v-model="params.aaddress">
                <i-option
                  v-for="item in list"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</i-option>
              </i-select>
            </form-item>
          </div>
        </div>
      </div>
    </i-form>
  </common-modal>
</template>

<script>
import services from "@/services";
import { prefixValidate, prefixValidateFunc } from "@/util/common";

export default {
  name: "editA4",
  data() {
    return {
      // 是否显示mode
      powerModal: false,
      list: [],
      viewId: "",
      dnsId: "",
      // 表单数据
      params: {
        prefix: "",
        clientacl: "",
        aaddress: ""
      },
      // 表单验证规则
      ruleValidate: {
        prefix: [
          { required: true, message: "请填正确的地址前缀", trigger: "change" },
          prefixValidate,
          {
            validator: prefixValidateFunc
          }
        ],
        clientacl: [
          { required: true, message: "请选择客户IP地址", trigger: "change" }
        ],
        aaddress: [
          { required: true, message: "请选择目标IPv4地址", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.getChoose();
  },
  methods: {
    openConfig(viewId, dnsId) {
      this.viewId = viewId;
      this.dnsId = dnsId;
      this.powerModal = true;
      this.getInitParams(viewId, dnsId);
    },
    getInitParams(viewId, dnsId) {
      services.getOneDNS64ById(viewId, dnsId).then(res => {
        this.params = res.data;
      });
    },
    getChoose() {
      services
        .getAccessList()
        .then(({ data }) => {
          this.list = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    update() {
      services
        .updateDNS64(this.viewId, this.dnsId, this.params)
        .then(res => {
          this.powerModal = false;
          this.$Message.success("修改成功!");
          this.$emit("onEditSuccess");
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
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
