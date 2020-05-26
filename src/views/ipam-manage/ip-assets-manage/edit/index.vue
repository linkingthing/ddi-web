<template>
  <common-modal  
    :visible.sync="dialogVisible"
    :width="415"
    title="新建"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div class="ip-assets-manage-edit">
      <Form
        ref="form"
        label-position="right"
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
    </div>
  </common-modal>
</template>

<script>
import { ipv4IsValid, ipv6IsValid } from "@/util/common";
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

      formModel: {
        ip: "",
        name: "",
        type: "",
        deployedservice: "",
        department: "",
        responsiblePerson: "",
        location: "",
        telephone: ""
      },
      
      formItemList,
      rules
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

    data: {
      immediate: true,
      handler(val) {
        this.setValue(val);
      }
    }
  },

  methods: {
    setValue(val) {
      if (!val) val = {};
      
      this.formModel = { ...val };
    },

    async handleConfirm() {
      try {
        await this.validate();

        this.loading = true;

        const action = this.data && this.data.id ? "$put" : "$post";

        await this[action]({ url: this.url, params: this.formModel });
        
        this.$$success("保存成功！");

        this.$emit("saved");

        this.dialogVisible = false;
      } 
      catch (err) {
        this.$$error(err.message);
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

<style lang="less">
@import "./index.less";
</style>