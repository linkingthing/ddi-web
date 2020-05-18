<template>
  <common-modal
    :visible.sync="dialogVisible"
    title="子网地址编辑"
    @confirm="handleConfirm"
    width="413"
  >
    <IviewLoading v-if="loading" />
    <Form
      :label-width="80"
      label-position="left"
      :label-colon="true"
    >
      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
      />
    </Form>

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
      formModel: {},
      formItemList: [
        {
          label: "dns",
          model: "dns",
          type: "input",
          placeholder: "请填写DNS，逗号隔开",
        },
        {
          label: "默认网关",
          model: "dns",
          type: "input",
          placeholder: "请填写默认网关"
        },
      ],
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