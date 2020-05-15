<template>
  <common-modal  
    :visible.sync="dialogVisible"
    title="子网地址编辑"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="subnet-info-edit">
      <div class="info-row-inline">
        <div class="info-row-label">DNS:</div>
        <Input
          maxlength="50"
          v-model="prefix"
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
      prefix: ""
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

        await this.$post({ url: this.url, prarams: this.getParams() });
        
        this.$$success("保存成功！");

        this.$emit("confirmed");
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
      let { prefix } = this;
      
      prefix = prefix.trim();

      return Promise.resolve();
    },

    getParams() {
      return {
        prefix: this.prefix.trim()
      };
    }
  }
};
</script>