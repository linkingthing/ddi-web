<template>
  <common-modal
    :visible.sync="dialogVisible"
    :width="415"
    :title="getTitle"
    custom-class="device-detect-edit"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />
    <Form
      ref="form"
      label-position="left"
      :label-width="100"
      :label-colon="true"
      :rules="rules"
      :model="formModel"
      style="height: 750px"
    >
      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
      />
    </Form>
  </common-modal>
</template>

<script>
import { formItemList, rules } from "./define";

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
    this.rules = rules;
    return {
      loading: false,
      dialogVisible: false,
      isEdit: false,
      url: this.$getApiByRoute().url,

      formModel: {
        name: "",
        administrationAddress: "",
        equipmentType: "",
        serialNumber: "",
        manufacturer: "",
        firmwareVersion: "",
        uplinkAddress: "",
        downlinkAddress: "",
        computerRoom: "",
        computerRack: "",
        location: "",
        department: "",
        responsiblePerson: "",
        telephone: ""
      }
    };
  },

  computed: {
    getTitle() {
      return this.isEdit ? "编辑" : "新建";
    },
    formItemList() {
      return formItemList(!this.isEdit);
    }
  },

  watch: {
    visible(val) {
      if (!val) return;

      this.dialogVisible = val;
    },

    dialogVisible(val) {
      if (!val) {
        this.$refs.form.resetFields();
      }

      this.$emit("update:visible", val);
    },

    data: {
      immediate: true,
      handler(val) {
        this.isEdit = !!val;
        this.setValue(val);
      }
    }
  },

  methods: {
    async setValue(val) {
      let value = val;

      if (!val) value = {};

      await this.$nextTick();

      this.formModel = {
        ...this.formModel,
        ...value
      };
    },

    async handleConfirm() {
      try {
        console.log(this.formModel)
        await this.validate();

        this.loading = true;

        let url = this.url;
        let action = "$post";

        if (this.isEdit) {
          url += "/" + this.data.id;
          action = "$put";
        }

        await this[action]({ url, params: this.formModel });

        this.$$success("保存成功！");

        this.$emit("saved");

        this.dialogVisible = false;
      } catch (err) {
        this.$handleError(err);
      } finally {
        this.loading = false;
      }
    },



    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          return valid ? resolve() : reject();
        });
      });
    }
  }
};
</script>

<style lang="less">
.device-detect-edit {
  .ivu-modal-body {
    max-height: 520px;
    overflow: auto;
  }
}
</style>