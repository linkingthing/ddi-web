<template>
  <common-modal
    class="domain-group-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('formInline')"
  >
    <IviewLoading v-if="loading" />
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
import { domainIsValid } from "@/util/common";

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
        { required: true, message: "请填写名称" }
      ],
      domains: [
        {
          validator: (rule, value, callback) => {
            if (value === "") {
              callback();
            }
            const isValid = value.split("\n").every(item => domainIsValid(item.trim()));
            if (isValid) {
              callback();
            } else {
              callback("请填写正确的域名，且换行分隔");
            }
          }
        }
      ]

    };
    return {
      formItemList: [
        {
          label: "名称",
          model: "name",
          type: "input",
          placeholder: "请填写名称"
        },

        {
          label: "域名",
          model: "domains",
          type: "textarea",
          autosize: { minRows: 4, maxRows: 8 },
          placeholder: "可以添加多个域名，并以换行符分隔",
        },

        {
          label: "备注",
          model: "comment",
          type: "input",
          placeholder: "请填写备注"
        }
      ],
      formModel: {
        name: ""
      },
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "域名组";
    },
    isEdit() {
      return !!this.links.update;
    }
  },

  watch: {

    visible(val) {
      if (!val) {
        this.$refs["formInline"].resetFields();
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then((data) => {
          this.formModel = {
            ...data,
            domains: data.domains.join("\n")
          };


        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    }

  },

  created() {

  },

  methods: {

    handleConfirm(name) {

      this.$refs[name].validate(valid => {
        if (valid) {
          const params = { ...this.formModel };
          params.domains = params.domains.split("\n");
          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(res => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            });
          } else {
            this.$post({ url: this.links.self, params }).then(res => {
              this.$$success("新建成功");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            });
          }
        }
      });



    }

  }
};
</script>

<style lang="less">
</style>