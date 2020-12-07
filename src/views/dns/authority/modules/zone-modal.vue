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
import { isIp } from "@/util/common";
import { ttlValidator } from "@/util/validator";

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
        { required: true, message: "请填写区名称" },
        {
          validator: (rule, value, callback) => {
            if (this.formModel.isarpa === "true") {
              const [ip, len] = value.split("/");
              const arr = [8, 16, 24];
              if (isIp(ip)) {
                if (arr.includes(Number(len))) {
                  callback();
                } else {
                  callback("子网范围只能是8/16/24三种之一");
                }
              } else {
                callback("请正确填写区名称");
              }

            }
            callback();
          }
        }
      ],
      isarpa: [
        { required: true, message: "请选择区类型" }
      ],
      ttl: [
        { required: true, message: "请填写TTL" },
        {
          validator: ttlValidator
        }
      ]
    };
    return {
      formModel: {
        zonetype: "master",
        ttl: 3600,
        isarpa: "false"
      },
      tempttl: "",
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "区";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {
      return [
        {
          label: "区名称",
          model: "name",
          type: "input",
          placeholder: "请填写区名称"
        },
        {
          label: "区类型",
          model: "isarpa",
          type: "radio",
          disabled: this.isEdit,
          placeholder: "请选择区类型",
          children: [{
            label: "false",
            text: "正向区"
          },
          {
            label: "true",
            text: "反向区"
          }]
        },
        {
          label: "TTL",
          model: "ttl",
          type: "input",
          placeholder: "请填写TTL",
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
        this.$refs.formInline.resetFields();
        this.formModel.zonetype = "master";
        this.formModel.isarpa = "false";
        this.formModel.ttl = this.tempttl;
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, isarpa, ttl, comment, zonetype }) => {
          this.formModel = {
            name,
            ttl,
            comment,
            isarpa: `${isarpa}`,
            zonetype
          };
        }).catch();
      } else {
        this.getGlobalConfig();
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
    getGlobalConfig() {
      this.$getData({}, "/dns/dns/dnsglobalconfigs").then(({ data: [res] }) => {
        this.formModel.ttl = res.ttl;
        this.tempttl = res.ttl;
      })
    },

    handleConfirm(name) {

      this.$refs[name].validate(valid => {
        if (valid) {

          this.loading = true;
          const params = { ...this.formModel };
          params.ttl = +params.ttl;
          params.isarpa = params.isarpa === "true";

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