<template>
  <common-modal
    :visible.sync="dialogVisible"
    :title="getTitle"
    @cancel="handleCancel"
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
      default: () => null
    }
  },

  data() {

    this.formItemList = [
      {
        label: "名称",
        model: "name",
        type: "input",
        placeholder: "请填写名称"
      },
      {
        label: "匹配条件",
        model: "regexp",
        type: "input",
        placeholder: "请填写匹配条件"
      }
    ];

    this.rules = {
      name: [
        {
          required: true,
          message: "请填写名称"
        },
        {
          validator: function (rule, value, callback) {
            if (value.length > 128) {
              callback("名称最长128个字符");
            }
            callback();
          }
        }
      ],
      regexp: [
        {
          required: true,
          message: "请填写匹配条件"
        },
        {
          validator: function (rule, value, callback) {
            if (value.length > 128) {
              callback("匹配条件最长128个字符");
            }
            callback();
          }
        }
      ]
    };
    return {
      loading: false,
      formModel: {
        name: "",
        regexp: ""
      },
      dialogVisible: false,
      optionId: "",
      optionName: "",
      optionType: "",
      isEdit: false
    };
  },

  computed: {
    getTitle() {
      return (this.links ? "编辑" : "添加") + "OPTION";
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        this.$refs.formInline.resetFields();
        return;
      }
      if (this.links.update) {
        this.$axios(this.links.self).then(({ data }) => {
          this.formModel = data;
        });
      }

      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    }
  },

  created() {
    console.log("created")
  },
  methods: {

    handleCancel() {
      this.dialogVisible = false;
    },

    handleConfirm(name) {
      this.$refs[name].validate(valid => {

        if (valid) {

          this.loading = true;
          if (this.links.update) {
            this.$put({ url: this.links.update, params: this.formModel }).then(res => {
              this.$$success("更新成功");
              this.dialogVisible = false;
              this.$emit("confirmed");
              this.loading = false;
            }).catch((err) => {
              this.loading = false;
            });
          } else {
            this.$createEntity(this.formModel).then(res => {
              this.$$success("创建成功");
              this.$emit("confirmed");
              this.dialogVisible = false;
              this.loading = false;
            }).catch(err => {
              this.loading = false;
              this.$$error(err.response.data.message);
            });
          }
        }
      });

    }

  }
};
</script>

<style>
</style>