<template>
  <Modal
    :title="title"
    v-model="dialogVisible"
    :closable="closable"
    :mask-closable="maskClosable"
    :class-name="`modal-custom ${customClass}`"
    :width="width"
    :footer-hide="!showFooter"
  >
    <div
      class="modal-header"
      slot="header"
    >
      {{ title }}
      <!-- <i class="el-icon-close" @click="handleClose" /> -->

      <div
        v-if="$slots['header-right']"
        class="header-right"
      >
        <slot name="header-right" />
      </div>
    </div>

    <slot />

    <template
      v-if="showFooter"
      slot="footer"
    >
      <slot name="footer" />

      <slot name="footer-left" />

      <Button
        class="button-cancel"
        type="default"
        @click="dialogVisible = false"
      >
        取消
      </Button>
      <Button
        class="button-confirm"
        type="primary"
        :loading="loading"
        :disabled="disabled"
        @click="handleClick"
      >
        {{okText}}
      </Button>

      <slot name="footer-right" />
    </template>
  </Modal>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>

export default {
  name: "DialogCustom",

  props: {
    loading: {
      type: Boolean,
      default: false
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

    width: {
      type: [String, Number],
      default: 520
    },
    okText: {
      type: String,
      default: "确认"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isEdit: false,
      isLoading: false
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
    handleClick() {
      this.$emit("confirm");
    }
  }
};
</script>

