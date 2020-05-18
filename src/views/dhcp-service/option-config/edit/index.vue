<template>
  <common-modal
    :visible.sync="dialogVisible"
    :title="getTitle"
    @cancel="handleCancel"
    @confirm="handleConfirm('formInline')"
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
import service from "@/services";

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
        placeholder: "请填写名称",
      },
      {
        label: "配置条件",
        model: "regexp",
        type: "input",
        placeholder: "请填写配置条件",
      },
    ];

    this.rules = {};
    return {
      formModel: {},
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
      if (!val) return;
      if (this.links) {
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
    console.log(11)

  },
  methods: {

    handleCancel() {
      this.dialogVisible = false;
    },

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {

        if (valid) {
          if (this.links) {
            this.$put({ url: this.links.update, params: this.formModel }).then(res => {
              this.$$success("更新成功");
              this.dialogVisible = false;
              this.$emit("confirmed");
            }).catch((err) => {

            });
          } else {
            this.$createEntity(this.formModel).then(res => {
              this.$$success("创建成功");
              this.$emit("confirmed");
              this.dialogVisible = false;
            }).catch(err => {
              console.dir(err)
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