<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    title="手动扫描提示"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="manual-scan-info">
      <h3>您确定开始子网扫描吗？</h3>
      <p>手动扫描将会在后台自动运行，可查看结果</p>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";

export default {
  components: {
    ModalCustom
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      default: () => ({})
    },

    url: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
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
      this.$emit("update:visible", val);
    }
  },

  methods: {
    async handleConfirm() {
      try {
        this.loading = true;

        await this.$post();

        this.$emit("confirmed");

        this.loading = false;

        return Promise.resolve();
      } 
      catch (err) {
        this.$$error(err.message || "保存失败");

        this.loading = false;

        return Promise.reject();
      }
    },

    getParams() {
      return {
        id: this.data.id
      };
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>