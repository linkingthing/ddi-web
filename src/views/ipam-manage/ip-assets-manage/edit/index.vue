<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="415"
    :title="getTitle"
    custom-class="ip-assets-edit"
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
    return {
      loading: false,
      dialogVisible: false,
      url: this.$getApiByRoute().url,

      formModel: this.initForm(),
      
      formItemList: [],
      rules
    };
  },

  computed: {
    getTitle() {
      return this.data && this.data.id ? "编辑" : "新建";
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
        
        if (this.$route.query.mac) {
          this.$refresh();
        }
      }

      this.$emit("update:visible", val);
    },

    data: {
      immediate: true,
      handler(val) {
        this.setValue(val);
      }
    }
  },

  methods: {
    async setValue(val) {
      let value = val || {};

      this.formItemList = formItemList(!val);

      await this.$nextTick();
      
      this.formModel = { 
        ...value,
        deviceType: value.deviceType || "pc"
      };
    },

    initForm() {
      return {
        mac: "",
        name: "",
        deviceType: "",
        switchName: "",
        computerRoom: "",
        computerRack: "",
        switchPort: "",
        deployedService: "",
        department: "",
        responsiblePerson: "",
        telephone: ""
      };
    },

    async handleConfirm() {
      try {
        await this.validate();

        this.loading = true;

        let url = this.url;
        let action = "$post";

        if (this.data && this.data.id) {
          url += "/" + this.data.id;
          action = "$put";
        }

        await this[action]({ url, params: this.formModel });
        
        this.$$success("保存成功！");

        this.$emit("saved");

        this.dialogVisible = false;
      } 
      catch (err) {
        this.$handleError(err);
      }
      finally {
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