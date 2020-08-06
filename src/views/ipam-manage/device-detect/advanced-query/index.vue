<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="415"
    title="高级搜索"
    @confirm="handleConfirm"
  >
    <Form
      ref="form"
      key="advanced-query"
      label-position="left"
      :label-width="120"
      :label-colon="true"
      :model="formModel"
    >
      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
      />
    </Form>
  </common-modal>
</template>

<script>
import { formItemList } from "./define";

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
      dialogVisible: false,    
      formModel: this.initForm(),      
      formItemList
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
    initForm() {
      return {
        serialNumber: "",
        firmwareVersion: "",
        uplinkAddress: "",
        downlinkAddress: "",
        computerRoom: "",
        computerRack: "",
        location: "",
        department: "",
        responsiblePerson: "",
        telephone: ""
      };
    },

    async handleConfirm() {
      this.$emit("comfirmed", this.formModel);

      this.dialogVisible = false;
    }
  }
};
</script>