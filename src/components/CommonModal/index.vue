<template>
  <Modal
    :title="title"
    v-model="dialogVisible"
    :closable="closable"
    :mask-closable="maskClosable"
    :class-name="`modal-custom ${customClass}`"
  >
    <div class="modal-header" slot="header">
      {{ title }}
      <i class="el-icon-close" @click="handleClose" />
    </div>

    <slot />

    <template v-if="showFooter" slot="footer">
      <Button
        v-if="buttons.cancel"
        class="button-cancel"
        type="primary"
        @click="handleClose"
      >{{ buttons.cancel.text }}</Button>
      <Button
        v-if="buttons.confirm"
        class="button-confirm"
        type="primary"
        @click="handleConfirm"
      >{{ buttons.confirm.text }}</Button>
    </template>
  </Modal>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
export default {
  name: "common-modal",

  props: {
    buttons: {
      type: Object,
      default: () => ({
        cancel: {
          text: "取消"
        },
        confirm: {
          text: "确定"
        }
      })
    },

    visible: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: ""
    },

    customClass: {
      type: String,
      default: ""
    },

    closable: {
      type: Boolean,
      default: false
    },

    maskClosable: {
      type: Boolean,
      default: false
    },

    showFooter: {
      type: Boolean,
      default: true
    },

    /**是否在点击确认按钮后立即关闭弹窗 */
    immediateCloseAfterConfirm: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      isEdit: false
    };
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },

  methods: {
    // 关于$listeners，若存在"confirm"和"cancel"需返回Promise

    handleConfirm() {
      this.$emit("confirm");
    },

    handleClose() {
      this.$emit("cancel");
      this.dialogVisible = false;
    },

  }
};
</script>

