<template>
  <common-modal  
    :visible.sync="dialogVisible"
    title="添加地址"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="subnet-info-edit">
      <div class="info-row-inline">
        <div class="info-row-label">网络地址</div>
        <Input
          maxlength="50"
          v-model="prefix"
          placeholder="请填写网络地址"
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
import { getAddressType } from "@/util/common";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    url: {
      type: String,
      default: ""
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
      prefix: "",
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
    },

    data(val) {      
      this.setValue(val);
    }
  },

  methods: {
    setValue(val = {}) {
      this.prefix = val.prefix || "";
    },

    async handleConfirm() {
      try {
        await this.validate();

        this.loading = true;

        await this.$post({ url: this.url, params: this.getParams() });
        
        this.$$success("保存成功！");

        this.$emit("saved");
      } 
      catch (err) {
        this.$$error(err.message);

        return Promise.reject();
      }
      finally {
        this.loading = false;
      }
    },

    validate() {
      let { prefix, description } = this;
      
      prefix = prefix.trim();

      return Promise.resolve();
    },

    getParams() {
      const temp = this.prefix.split("/");

      return {
        prefix: this.prefix.trim(),
        maskLen: getAddressType(temp[0]) === "ipv4" ? 24 : 64,
        description: this.description
      };
    }
  }
};
</script>