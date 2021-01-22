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
      :label-width="85"
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
import { ipv6IsValid, ipv4IsValid, domainReg } from "@/util/common";
import { ttlValidator, serverValidator } from "@/util/validator";
import IPListInput from "@/components/IPListInput";


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

    return {
      formModel: {
        name: "",
        ttl: 3600,
        zoneType: "standard",
        role: "master",
        masters: [],
        slaves: []
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
    rules() {
      const isEdit = this.isEdit;
      return {
        name: [
          { required: !isEdit, message: "请填写区名称" },
          {
            validator: (rule, value, callback) => {
              if (isEdit) {
                callback();
              }
              if (this.formModel.zoneType === "arpa") {
                const [ip, len] = value.split("/");

                if (ipv6IsValid(value)) {
                  if (Number(len) > 128) {
                    callback("IPv6地址前缀不能超过128");
                  }
                  if (Number(len) <= 0) {
                    callback("IPv6地址前缀不能小于等于0");
                  }

                } else if (ipv4IsValid(value)) {
                  if (Number(len) > 32) {
                    callback("IPv4地址前缀不能超过32");
                  }
                  if (Number(len) <= 0) {
                    callback("IPv4地址前缀不能小于等于0");
                  }
                } else {
                  callback("请正确填写区名称");
                }
                callback();

              } else {
                // 区名称用域名规则校验

                if (value.includes("*")) {
                  callback("请正确填写区名称");
                }

                if (value === "@") {
                  callback();
                }

                if (domainReg.test(value)) {
                  callback();
                } else {
                  callback("请正确填写区名称");
                }

              }
            }
          }
        ],
        zoneType: [
          { required: true, message: "请选择区类型" }
        ],
        role: [
          { required: true, message: "请选择区角色" },

        ],
        masters: [{ required: true, message: "请输入主区地址" },
        {
          validator: (rule, value, callback) => {
            if (this.formModel.role === "slave" && this.formModel.masters.filter(item => item.trim()).length === 0) {
              callback("请输入主区地址");
            }
            if (this.formModel.masters.length > 1) {
              callback("主区只能输入一条");
            }
            callback();
          }
        }, {
          validator: serverValidator
        }],
        slaves: [{
          validator: serverValidator
        }],
        ttl: [
          { required: true, message: "请填写TTL" },
          {
            validator: ttlValidator
          }
        ]
      };
    },
    formItemList() {

      let serverList = {
        label: "辅服务器",
        model: "slaves",
        type: "component",
        component: IPListInput,
        props: {
          placeholder: `可以添加多个辅服务器，并以换行符分隔，
格式，IP地址：端口
例如：29.23.34.34:400,[2001::FFF1]:8089
端口选填，默认值为53`
        }
      };

      if (this.formModel.role === "slave") {
        serverList = {
          label: "主服务器",
          model: "masters",
          type: "component",
          component: IPListInput,
          props: {
            placeholder: `可以添加多个主服务器，并以换行符分隔，
格式，IP地址：端口
例如：29.23.34.34:400,[2001::FFF1]:8089
端口选填，默认值为53`

          }
        };
      }

      return [
        {
          label: "区名称",
          model: "name",
          type: "input",
          placeholder: "请填写区名称"
        },
        {
          label: "区类型",
          model: "zoneType",
          type: "radio",
          disabled: this.isEdit,
          placeholder: "请选择区类型",
          children: [{
            label: "standard",
            text: "正向区"
          },
          {
            label: "arpa",
            text: "反向区"
          }]
        },
        {
          label: "TTL",
          model: "ttl",
          type: "input",
          placeholder: "请填写TTL"
        },
        {
          label: "区角色",
          model: "role",
          type: "radio",
          children: [
            {
              text: "主区",
              label: "master"
            },
            {
              text: "辅区",
              label: "slave"
            }
          ]
        },
        serverList,
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
        this.formModel.ttl = this.tempttl;
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ masters, slaves, ...rest }) => {
          this.formModel = {
            masters: masters || [],
            slaves: slaves || [],
            ...rest
          };
        }).catch();
      } else {
        this.getGlobalConfig();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    "formModel.zoneType": {
      deep: true,
      handler() {
        this.$refs["formInline"].validateField("name");
      }
    },
    "formModel.masters": {
      deep: true,
      handler() {
        this.$refs["formInline"].validateField("masters");
      }
    },
    "formModel.slaves": {
      deep: true,
      handler() {
        this.$refs["formInline"].validateField("slaves");
      }
    }
  },

  created() {

  },

  methods: {
    getGlobalConfig() {
      this.$getData({}, "/dns/dns/dnsglobalconfigs").then(({ data: [res] }) => {
        this.$refs.formInline.resetFields();
        this.formModel.ttl = res.ttl;
        this.tempttl = res.ttl;
      });
    },

    handleConfirm(name) {

      this.$refs[name].validate(valid => {
        if (valid) {

          this.loading = true;
          const params = { ...this.formModel };
          params.ttl = +params.ttl;

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