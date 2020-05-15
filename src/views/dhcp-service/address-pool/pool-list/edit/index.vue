<template>
  <common-modal 
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="560"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="address-pool-info">
      <div class="info-row">
        <div class="info-row-label">开始地址</div>
        <Input
          maxlength="50"
          v-model="beginAddress"
          placeholder="请输入开始名称"
          class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">结束地址</div>
        <Input
          maxlength="50"
          v-model="endAddress"
          placeholder="请输入结束地址"
          class="info-row-input" />
      </div>
      <div class="info-row">
        <div class="info-row-label">默认租赁时间</div>
        <Input
          maxlength="16"
          v-model="validLifetime"
          class="info-row-input" />
        <label>秒</label>
      </div>
      <div class="info-row">
        <div class="info-row-label">最大租赁时间</div>
        <Input
          maxlength="16"
          v-model="maxValidLifetime"
          class="info-row-input" />
        <label>秒</label>
      </div>
      <div class="info-row">
        <div class="info-row-label">域名服务器</div>
        <Input
          maxlength="255"
          v-model="dnsServer"
          placeholder="请输入域名服务器"
          class="info-row-input" />
      </div>
      <div class="info-row" v-if="type === 'ipv4'">
        <div class="info-row-label">路由服务器</div>
        <Input
          maxlength="255"
          v-model="gateway"
          placeholder="请输入路由服务器"
          class="info-row-input" />
      </div>
    </div>
  </common-modal >
</template>

<script>
import service from "@/services";

import { 
  ipv6IsValid, 
  isIPv4Reg, 
  getAddressType, 
  isPosNumber 
} from "@/util/common";

const types = [
  {
    label: "ipv4",
    value: "ipv4"
  },
  {
    label: "ipv6",
    value: "ipv6"
  }
];

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    subnetId: {
      type: String,
      default: null
    },

    type: {
      type: String,
      default: "ipv4"
    },

    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      loading: false,
      dialogVisible: false,
      types,
      beginAddress: "",
      endAddress: "",
      validLifetime: "",
      maxValidLifetime: "",
      gateway: "",
      dnsServer: "",
      isEdit: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "添加") + "地址池";
    }
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    data(val) {
      this.isEdit = !!val;

      this.setValue(val);
    },

    dialogVisible(val) {
      if (!val) {        
        this.setValue();
      }

      this.$emit("update:visible", val);
    }
  },

  methods: {
    setValue(val) {
      if (!val) val = {};

      this.poolId = val.embedded ? val.embedded.id : val.id || null;
      this.beginAddress = val.beginAddress || "";
      this.endAddress = val.endAddress || "";
      this.validLifetime = val.validLifetime || "";
      this.maxValidLifetime = val.maxValidLifetime || "";
      this.gateway = val.gateway || "";
      this.dnsServer = val.dnsServer || "";
    },

    async handleConfirm() {
      const action = this.type === "ipv4" ? "saveIpv4AddressPool" : "saveIpv6AddressPool";

      try {
        await this.validate();

        this.loading = true;

        let { status, message } = await service[action](this.getParams());

        status = +status;

        if (status === 200 || status === 201) {
          this.$emit("success");
        }
        else {
          Promise.reject({ message: message || "保存失败！" });
        }

        this.loading = false;
      } catch (err) {
        this.$$error(err.message);

        console.error(err);

        this.loading = false;

        return Promise.reject();
      }
    },

    getParams() {
      return {
        subnetId: this.subnetId,
        poolId: this.poolId,
        type: this.isEdit ? "put" : "post",
        params: {
          beginAddress: this.beginAddress,
          endAddress: this.endAddress,
          validLifetime: this.validLifetime,
          maxValidLifetime: this.maxValidLifetime,
          gateway: this.gateway,
          dnsServer: this.dnsServer
        }
      };
    },

    /**
     * 比较IP的先后顺序
     */
    compareIpAddress(beginAddress, endAddress) {
      const type = getAddressType(beginAddress);

      let isBefore = false;

      if (type === "ipv4") {
        let beginArr = beginAddress.split("."),
          endArr = endAddress.split(".");
        
        const res = beginArr.map((item,idx) => [parseInt(item), parseInt(endArr[idx])]);

        for (let i = 0; i < res.length; i++) {
          let item = res[i];

          if (item[0] > item[1]) {
            isBefore = true;

            break;
          }
        }

        return isBefore;
      }
    },

    validate() {
      let { 
        beginAddress, 
        endAddress, 
        validLifetime, 
        maxValidLifetime,
        gateway,
        dnsServer
      } = this;

      beginAddress = beginAddress.trim();
      endAddress = endAddress.trim();
      validLifetime = validLifetime.trim();
      maxValidLifetime = maxValidLifetime.trim();
      gateway = gateway.trim();
      dnsServer = dnsServer.trim();

      const beginType = getAddressType(beginAddress);
      const endType = getAddressType(endAddress);

      if (!beginAddress) {
        return Promise.reject({ message: "请填写开始地址！" });
      }

      if (!endAddress) {
        return Promise.reject({ message: "请填写结束地址！" });
      }

      if (!validLifetime) {
        return Promise.reject({ message: "请填写默认租赁时间！" });
      }

      if (validLifetime.length > 12 || !isPosNumber(validLifetime)) {
        return Promise.reject({ message: "请填写正确的默认租赁时间！" });
      }

      if (!maxValidLifetime) {
        return Promise.reject({ message: "请填写最大租赁时间！" });
      }

      if (maxValidLifetime.length > 12 || !isPosNumber(maxValidLifetime)) {
        return Promise.reject({ message: "请填写正确的最大租赁时间！" });
      }
      
      if (parseInt(validLifetime) > parseInt(maxValidLifetime)) {
        return Promise.reject({ message: "最大租赁时间不能小于默认租赁时间！" });
      }

      if (beginType !== endType) {
        return Promise.reject({ message: "开始地址与结束地址类型须一致！" });
      }

      if (this.type === "ipv4") {
        if (!isIPv4Reg.test(beginAddress)) {
          return Promise.reject({ message: "请填写正确的开始地址！" });
        }
        
        if (!isIPv4Reg.test(endAddress)) {
          return Promise.reject({ message: "请填写正确的结束地址！" });
        }
      }

      if (this.type === "ipv6") {
        if (!ipv6IsValid(beginAddress)) {
          return Promise.reject({ message: "请填写正确的开始地址！" });
        }
        
        if (!ipv6IsValid(endAddress)) {
          return Promise.reject({ message: "请填写正确的结束地址！" });
        }
      }

      if (this.type === "ipv4") {
        if (dnsServer && !isIPv4Reg.test(dnsServer)) {
          return Promise.reject({ message: "请填写正确的域名服务器地址！" });
        }
      }

      if (this.type === "ipv6") {
        if (dnsServer && !ipv6IsValid(dnsServer)) {
          return Promise.reject({ message: "请填写正确的域名服务器地址！" });
        }
      }

      if (this.type === "ipv4") {
        if (gateway && !isIPv4Reg.test(gateway)) {
          return Promise.reject({ message: "请填写正确的路由服务器地址！" });
        }
      }

      return Promise.resolve();
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>