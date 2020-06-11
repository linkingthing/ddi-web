<template>
  <common-modal
    class="zone-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('formInline')"
  >
    <IviewLoading v-if="loading" />
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
        label: "区名称",
        model: "name",
        type: "input",
        placeholder: "请填写区名称"
      },
      {
        label: "区类型",
        model: "isarpa",
        type: "radio",
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
        type: "number",
        placeholder: "请填写TTL",
        max: 86400
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
        { required: true, message: "请填写TTL" }
      ]
    };
    return {
      formModel: {
        zonetype: "master",
        ttl: 3600,
        isarpa: "false"
      },
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
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        this.formModel = {
          zonetype: "master",
          ttl: 3600,
          isarpa: "false"
        };
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
          params.isarpa = params.isarpa === "true";

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
.zone-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>