<template>
  <common-modal
    class="subnet-type-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('formInline')"
    :loading="loading"
  >
    <Form
      ref="formInline"
      label-position="left"
      :label-width="100"
      :label-colon="true"
      :rules="rules"
      :model="formModel"
    >

      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
        :show-fields="isEdit ? ['name'] : []"
      />

    </Form>
  </common-modal>
</template>

<script>


export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    links: {
      type: Object,
      default: () => ({})
    }
  },

  data() {

    this.rules = {
      name: [
        { required: true, message: "请填子网类型名称" },
      ],
      comment: [
        // { required: true, message: "请填备注" },
      ],
    };
    return {
      formModel: {
        name: "",
        custom: true,
        comment: ""
      },
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "子网类型";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {
      return [
        {
          label: "子网类型",
          model: "name",
          type: "input",
          placeholder: "请填写子网类型名称",
        },
        {
          label: "备注",
          model: "comment",
          type: "input",
          placeholder: "请填写备注"
        }
      ];
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        this.reset();
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, status, ips, comment, isp }) => {
          this.formModel = {
            name,
            ips,
            comment,
            status,
            isp,
            lineType: !!isp ? "isp" : "custom"
          };
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },

    "formModel.lineType"(val) {
      if (val === "custom") {
        this.formModel.isp = "";
      } else {
        this.formModel.ips = [];
      }
    },
    "formModel.ips": {
      deep: true,
      handler() {
        if (this.formModel.lineType === "custom") {
          this.$nextTick().then(() => {
            this.$refs["formInline"].validateField("ips");
          });
        }
      }
    }
  },

  created() {

  },

  methods: {
    reset() {
      this.$refs["formInline"].resetFields();
      this.formModel.status = "allow";
      this.formModel.lineType = "isp";
    },

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = { ...this.formModel };
          this.loading = true;
          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(res => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
              this.loading = false;
            }).catch(err => {
              this.loading = false;
              this.$$error(err.response.data.message);
            });
          } else {
            this.$post({ url: this.links.self, params }).then(res => {
              this.$$success("新建成功");
              this.$emit("success");
              this.dialogVisible = false;
              this.loading = false;
            }).catch(err => {
              this.loading = false;
              this.$$error(err.response.data.message);
            });
          }
        } else {
          console.log(this.formModel, "fail")
        }
      });
    }

  }
};
</script>

<style lang="less">
.subnet-type-modal {
}
</style>