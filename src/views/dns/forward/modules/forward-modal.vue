<template>
  <common-modal
    class="zone-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('formInline')"
    :loading="loading"
  >
    <Form
      ref="formInline"
      label-position="left"
      :label-width="80"
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
import {
  ipv4IsValid,
  ipv6IsValid
} from "@/util/common";

import { emptyStringValidator, serverValidator } from "@/util/validator";

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
    this.formItemList = [
      {
        label: "组名称",
        model: "name",
        type: "input",
        placeholder: "请填写组名称"
      },
      {
        label: "服务器",
        model: "addresses",
        type: "textarea",
        placeholder: `可以添加多个转发服务器，并以换行符分隔，
格式，IP地址：端口
例如：29.23.34.34:400,[2001::FFF1]:8089
端口选填，默认值为53
`,
        autosize: { minRows: 4, maxRows: 8 }
      },

      {
        label: "备注",
        model: "comment",
        type: "input",
        placeholder: "请填写备注"
      }
    ];

    this.rules = {
      name: [
        { required: true, message: "请填写组名称" }
      ],
      addresses: [
        { required: true, message: "请填写转发服务器" },
        {
          message: "请输入服务器地址",
          validator: emptyStringValidator
        },
        {
          validator: serverValidator
        }
      ]
    };
    return {
      formModel: {
        zonetype: "master",
        addresses: "",
        name: ""
      },
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "组";
    },
    isEdit() {
      return !!this.links.update;
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        this.$refs.formInline.resetFields();
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, addresses, comment }) => {
          this.formModel = {
            name,
            addresses: addresses.join("\n"),
            comment
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
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = { ...this.formModel };

          this.loading = true;
          if (typeof params.addresses === "string") {
            if (params.addresses.trim().length) {
              params.addresses = params.addresses.split("\n").map(item => item.trim());
            } else {
              params.addresses = [];
            }
          } else {
            params.addresses = [];
          }

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
        }
      });


    }

  }
};
</script>

<style lang="less">
.zone-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>