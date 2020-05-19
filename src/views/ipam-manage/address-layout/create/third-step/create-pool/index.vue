<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="415"
    title="创建子网"
    :buttons="buttons"
    custom-class="layout-create-subnet"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />
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

    prefix: {
      type: String,
      default: ""
    },

    /**
     * 规划所设置的该IP的掩码长度
     */
    maskLen: {
      type: Number,
      default: 0
    },

    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: false,
      dialogVisible: false
    };
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.init();

      this.$emit("update:visible", val);
    }
  },

  methods: {
    handleConfirm(res) {}
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>