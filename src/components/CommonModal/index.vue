<template>
  <Modal
    :title="title"
    v-model="dialogVisible"
    :closable="closable"
    :mask-closable="maskClosable"
    :class-name="`modal-custom ${customClass}`"
    :width="width"
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
      <slot name="footer-left" />

      <Button
        v-for="button in buttons"
        :key="button.label"
        :class="button.class"
        :type="typeList.includes(button.type) ? button.type : 'primary'"
        @click="handleButtonClick(button)"
      >
        {{ button.label }}
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
    buttons: {
      type: Array,
      default: () => [
        {
          label: "取消",
          type: "cancel",
          class: "button-cancel",
          event: "cancel"
        },
        {
          label: "确认",
          type: "primary",
          class: "button-confirm",
          event: "confirm"
        }
      ]
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
    }
  },

  data() {
    this.typeList = ["default", "primary", "dashed", "text", "info", "success", "warning", "error"];
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
    async handleButtonClick(button) {
      const listener = this.$listeners[button.event];

      if (button.event === "cancel") {
        this.dialogVisible = false;
      }

      listener && listener();
    }
  }
};
</script>

