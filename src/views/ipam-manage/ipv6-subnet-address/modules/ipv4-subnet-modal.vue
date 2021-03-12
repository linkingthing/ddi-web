<template>
  <common-modal
    class="ipv4-subnet-modal"
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
        :show-fields="isEdit ? ['prefix'] : []"
      />

    </Form>
  </common-modal>
</template>

<script>
const presetSubnetTypeMap = {
  guest: "访客子网",
  management: "管理子网",
  office: "办公子网",
  server: "服务器子网",
  vpn: "VPN子网"
}
import { isIpv6Segment } from "@/util/common";

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
      prefix: [
        { required: true, message: "请填子网地址" },
        {
          validator: (rule, value, callback) => {
            if (!isIpv6Segment(value)) {
              callback("请输入正确IPv6地址");
            } else {
              callback();
            }
          }
        }
      ],
      comment: [
        // { required: true, message: "请填备注" },
      ],
    };
    return {
      formModel: {
        prefix: "",
        name: "",
        semanticId: "",
        semanticName: "",
        networkType: "",
        business: "",
        comment: ""
      },
      loading: false,
      dialogVisible: false,
      subnetTypeList: [],
      semanticList: [],
      hasSemanticId: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "Ipv6子网";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {
      let disabled = false;
      if (this.isEdit && this.hasSemanticId) {
        disabled = true
      }
      return [
        {
          label: "子网地址",
          model: "prefix",
          type: "input",
          placeholder: "请填写子网地址,例：32::/32",
        },
        {
          label: "子网名称",
          model: "name",
          type: "input",
          placeholder: "请填写子网名称",
        },
        {
          label: "组织机构",
          model: "semanticId",
          type: "select",
          placeholder: "请填写组织机构",
          filterable: true,
          clearable: true,
          disabled,
          children: this.semanticList.map(item => {
            return {
              text: item.name,
              label: item.id
            }
          })
        },
        {
          label: "子网类型",
          model: "networkType",
          type: "select",
          placeholder: "请填写子网类型名称",
          filterable: true,
          clearable: true,
          children: this.subnetTypeList.map(item => {
            return {
              text: presetSubnetTypeMap[item.name] || item.name,
              label: item.id
            }
          })
        },
        {
          label: "业务",
          model: "business",
          type: "input",
          placeholder: "请填写业务"
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
        this.$get({ url: this.links.self }).then(({ name, prefix, semanticId, networkType, business, comment }) => {
          this.formModel = {
            name,
            prefix,
            comment,
            semanticId,
            networkType,
            business
          };

          this.hasSemanticId = semanticId;

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
    this.getSubnetType();
    this.getSemanticList();
  },

  methods: {

    getSemanticList() {
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/semantics" }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {
          const [{ links }] = data;
          this.$post({ url: `${links.self}?action=list_tree` }).then((data) => {
            this.semanticList = data || [];
          })
        }
      })
    },

    getSubnetType() {
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/networktypes" }).then(({ data }) => {
        this.subnetTypeList = data;
      })
    },
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
.ipv4-subnet-modal {
}
</style>