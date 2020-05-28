<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="415"
    :title="getTitle"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="device-scan-edit">
      <div class="info-row-inline">
        <div class="info-row-label">探测设备IP</div>
        <Input
          maxlength="50"
          v-model="address"
          placeholder="请输入探测设备IP"
          class="info-row-input" />
      </div>

      <div class="info-row-inline">
        <div class="info-row-label">SNMP团体名</div>
        <Input
          maxlength="255"
          v-model="community"
          placeholder="请输入SNMP团体名"
          class="info-row-input" />
      </div>
    </div>
  </common-modal>
</template>

<script>
import { ipv4IsValid, ipv6IsValid } from "@/util/common";

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
      address: "",
      community: "public"
    };
  },

  computed: {
    getTitle() {
      return this.isEdit ? "编辑" : "新建";
    }
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.setValue();

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

      this.address = val.address || "";
      this.community = val.community || "public";
    },

    async handleConfirm() {
      try {
        await this.validate();

        this.loading = true;

        let url = this.url;
        let action = "$post";

        if (this.isEdit) {
          url += "/" + this.data.id;
          action = "$put";
        }

        await this[action]({ url, params: this.getParams() });
        
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
      let { address, community } = this;

      address = address.trim();
      community = community.trim();
      
      if (!ipv4IsValid(address) && !ipv6IsValid(address)) {
        return Promise.reject({ message: "请输入正确的探测设备IP！" });
      }

      if (!/^[a-zA-Z0-9]+$/g.test(community)) {
        return Promise.reject({ message: "请输入正确的SNMP团体名！" });
      }

      return Promise.resolve();
    },

    getParams() {
      return {
        address: this.address.trim(),
        community: this.community.trim()
      };
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>