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

      formModel: {
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
        telephone: "",
        vlanId: "",
        ipv4s: "",
        ipv6s: ""
      },

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

      if (value.vlanId === 0) {
        value.vlanId = "";
      }
      this.formItemList = formItemList(!val);

      await this.$nextTick();


      for (const attr in this.formModel) {
        this.formModel[attr] = value[attr];
      }
      this.formModel.ipv4s = Array.isArray(value.ipv4s) ? value.ipv4s.join(",") : "";
      this.formModel.ipv6s = Array.isArray(value.ipv6s) ? value.ipv6s.join(",") : "";
      this.formModel.deviceType = value.deviceType || "pc";

    },
    handleConfirm() {


      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;

          let url = this.url;
          let action = "$post";

          if (this.data && this.data.id) {
            url += "/" + this.data.id;
            action = "$put";
          }

          // action 注册, 只有存在的情况才注册
          if (this.data && this.data.shouldRegister) {
            url += `?action=refresh`;
            action = "$post";
          }

          const params = {
            ...this.formModel
          };
          params.ipv4s = params.ipv4s.split(",").filter(item => !!item.trim());
          params.ipv6s = params.ipv6s.split(",").filter(item => !!item.trim());
          params.vlanId = +params.vlanId;

          this[action]({ url, params }).then(() => {
            this.$$success("保存成功！");
            this.$emit("saved");
            this.dialogVisible = false;
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          }).finally(() => {
            this.loading = false;
          });
        }
      });

    }



  }
};
</script>

<style lang="less">
.ip-assets-edit {
  .ivu-modal-body {
    max-height: 520px;
    overflow: auto;
  }
}
</style>