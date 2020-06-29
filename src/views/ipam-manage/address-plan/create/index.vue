<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="415"
    title="新建网络"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="address-plan-create">
      <div class="info-row-inline">
        <RadioGroup v-model="ipType" @on-change="handleIpTypeChange">
          <Radio label="IPv4"/>
          <Radio label="IPv6"/>
        </RadioGroup>
      </div>

      <div class="info-row-inline">
        <div class="info-row-label"><i class="is-required">*</i>网络地址</div>
        <Input
          ref="prefix"
          maxlength="50"
          v-model="prefix"
          placeholder="请填写网络地址"
          class="info-row-input" />
      </div>

      <div class="info-row-inline">
        <div class="info-row-label"><i class="is-required">*</i>子网规划范围</div>
        <Input
          ref="maskLen"
          maxlength="2"
          v-model="maskLen"
          placeholder="请填写子网规划范围"
          class="info-row-input" />
      </div>

      <div class="info-row-inline">
        <div class="info-row-label">备注</div>
        <Input
          maxlength="255"
          v-model="description"
          placeholder="请填写备注"
          class="info-row-input" />
      </div>
    </div>
  </common-modal>
</template>

<script>
import { ipv4IsValid, ipv6IsValid, isPosNumber, maskIsValid } from "@/util/common";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      dialogVisible: false,
      url: this.$getApiByRoute().url,
      ipType: "IPv4",
      prefix: "",
      maskLen: "",
      description: ""
    };
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.setValue();

      this.$emit("update:visible", val);
    }
  },

  methods: {
    setValue(val = {}) {
      this.prefix = val.prefix || "";
      this.maskLen = val.maskLen || "";
      this.description = "";
      this.ipType = "IPv4";
    },

    handleIpTypeChange(type) {
      this.ipType = type;
      this.prefix = "";
      this.maskLen = "";
      this.description = "";
    },

    async handleConfirm() {
      try {
        await this.validate();

        this.loading = true;

        await this.$post({ url: this.url, params: this.getParams() });
        
        this.$$success("保存成功！");

        this.$emit("saved");

        this.dialogVisible = false;
      } 
      catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    },

    validate() {
      let { ipType, prefix, maskLen } = this;

      prefix = prefix.trim();
      maskLen = maskLen.trim();
      
      let addrArr = prefix.split("/");

      if (ipType === "IPv4") {
        if (!ipv4IsValid(addrArr[0]) || !maskIsValid(addrArr[1], "ipv4", [1, 23])) {
          this.$refs.prefix.focus();          

          return Promise.reject({ message: "请输入正确的网络地址！" });
        }

        if (!maskIsValid(maskLen, "ipv4")) {
          this.$refs.maskLen.focus();          

          return Promise.reject({ message: "子网可规划范围须大于网络前缀，不超过24位！" });
        }
      }
      else if (ipType === "IPv6") {
        if (!ipv6IsValid(addrArr[0]) || !maskIsValid(addrArr[1], "ipv6")) {
          this.$refs.prefix.focus();          

          return Promise.reject({ message: "请输入正确的网络地址！" });
        }

        if (!maskIsValid(maskLen, "ipv6")) {
          this.$refs.maskLen.focus();          

          return Promise.reject({ message: "子网可规划范围须大于网络前缀，不超过64位！" });
        }
      }

      if (parseInt(maskLen) <= addrArr[1]) {
        this.$refs.maskLen.focus();   
          
        return Promise.reject({ message: "子网可规划范围必须大于网络前缀！" });
      }

      return Promise.resolve();
    },

    getParams() {
      return {
        prefix: this.prefix.trim(),
        maskLen: parseInt(this.maskLen.toString().trim()),
        description: this.description
      };
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>