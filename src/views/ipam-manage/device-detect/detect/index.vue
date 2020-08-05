<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="415"
    title="网络探测"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="device-net-work">
      <div class="info-row-inline">
        <div class="info-row-label">探测地址</div>
        <Input
          disabled
          maxlength="50"
          v-model="administrationAddress"
          placeholder="请输入探测地址"
          class="info-row-input" />
      </div>

      <div class="info-row-inline">
        <div class="info-row-label">SNMP探测端口</div>
        <Input
          maxlength="5"
          v-model="snmpPort"
          placeholder="请输入SNMP探测端口"
          class="info-row-input" />
      </div>

      <div class="info-row-inline">
        <div class="info-row-label">SNMP团体名</div>
        <Input
          maxlength="255"
          v-model="snmpCommunity"
          placeholder="请输入SNMP团体名"
          class="info-row-input" />
      </div>
    </div>
  </common-modal>
</template>

<script>
import { ipv4IsValid, ipv6IsValid, portIsValidate } from "@/util/common";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      default: () => null
    }
  },

  data() {
    return {
      loading: false,
      dialogVisible: false,
      isEdit: false,
      url: this.$getApiByRoute().url,
      administrationAddress: "",
      snmpPort: 161,
      snmpCommunity: "public"
    };
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      if (!val) {
        this.setValue();
      }

      this.$emit("update:visible", val);
    },

    data: {
      immediate: true,
      handler(val) {
        this.isEdit = val && Object.keys(val).length;

        this.setValue(val);
      }
    }
  },

  methods: {
    setValue(val) {
      if (!val) val = {};

      this.administrationAddress = val.administrationAddress || "";
      this.snmpCommunity = val.snmpCommunity || "public";
      this.snmpPort = val.snmpPort || 161;
    },

    async handleConfirm() {
      try {
        await this.validate();

        this.loading = true;

        let url = this.url + "/" + this.data.id;

        await this.$put({ url, params: this.getParams() });
        
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
      let { administrationAddress, snmpCommunity, snmpPort } = this;

      administrationAddress = administrationAddress.trim();
      snmpCommunity = snmpCommunity.trim();
      snmpPort = +snmpPort.trim();
      
      if (!ipv4IsValid(administrationAddress) && !ipv6IsValid(administrationAddress)) {
        return Promise.reject({ message: "请输入正确的探测设备IP！" });
      }

      if (!portIsValidate(snmpPort)) {
        return Promise.reject({ message: "请输入正确的SNMP探测端口号！" });
      }

      if (!/^[a-zA-Z0-9]+$/g.test(snmpCommunity)) {
        return Promise.reject({ message: "请输入正确的SNMP团体名！" });
      }

      return Promise.resolve();
    },

    getParams() {
      return {
        administrationAddress: this.administrationAddress.trim(),
        snmpCommunity: this.snmpCommunity.trim(),
        snmpPort: this.snmpPort.trim()
      };
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>