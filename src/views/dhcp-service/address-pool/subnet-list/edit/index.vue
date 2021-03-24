<template>
  <common-modal
    :visible.sync="dialogVisible"
    :title="getTitle"
    @confirm="handleConfirm"
    width="413"
    :loading="loading"
  >
    <Form
      ref="form"
      :label-width="100"
      label-position="left"
      :label-colon="true"
      :model="formModel"
      :rules="rules"
    >
      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
      />
    </Form>

  </common-modal>
</template>

<script>
import { ipv6IsValid, ipv4IsValid, isIpv4Segment, isIpv6Segment } from "@/util/common";
import { resArrayToString, resStringToArray } from "@/util/parser";
import ClientClassFormItem from "./ClientClassFormItem";

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
      loading: false,
      dialogVisible: false,
      networkTypeList: [],
      formModel: {
        version: 4,
        subnet: "",
        tags: "",
        networkType: "",
        domainServers: ""
      }

    };
  },

  computed: {
    getTitle() {
      return this.isCreate ? "新增子网地址" : "编辑子网地址";
    },
    rules() {

      return {
        subnet: [
          { required: true, message: "请填写子网地址" },
          {
            validator: (rule, value, callback) => {

              if (this.formModel.version === 4) {
                if (!isIpv4Segment(value)) {
                  callback("请输入正确IPv4地址");
                }

              }
              if (this.formModel.version === 6) {
                if (!isIpv6Segment(value)) {
                  callback("请输入正确IPv6地址");
                }
              }

              if (!value.includes("/")) {
                callback("请输入正确IP地址网段");
              }
              callback();
            }
          }
        ]
      };
    },
    formItemList() {
      let formListResult = [];
      const networkTypeSelect = this.networkTypeList.map(item => {
        return {
          label: item.id,
          text: item.name
        }
      })
      const ipv4FormList = [
        {
          label: "子网地址",
          model: "subnet",
          type: this.isCreate ? "input" : "text",
          placeholder: "请填写子网地址"
        },
        {
          label: "子网名称",
          model: "tags",
          type: "input",
          placeholder: "请输入子网名称"
        },
        {
          label: "子网类型",
          model: "networkType",
          type: "select",
          placeholder: "请输入子网类型",
          children: networkTypeSelect
        },
        {
          label: "DNS",
          model: "domainServers",
          type: "input",
          placeholder: "请填写DNS，逗号隔开"
        },
        {
          label: "默认网关",
          model: "routers",
          type: "input",
          placeholder: "请填写默认网关"
        },
        {
          label: "option 60",
          model: "clientClass",
          type: "component",
          component: ClientClassFormItem
        },
        {
          label: "option 82",
          model: "relayAgentAddresses",
          type: "input",
          placeholder: "请填写option82"
        }
      ];

      const ipv6FormList = [
        {
          label: "子网地址",
          model: "subnet",
          type: this.isCreate ? "input" : "text",
          placeholder: "请填写子网地址"
        },
        {
          label: "子网名称",
          model: "tags",
          type: "input",
          placeholder: "请输入子网名称"
        },
        {
          label: "子网类型",
          model: "networkType",
          type: "select",
          placeholder: "请输入子网类型",
          children: networkTypeSelect
        },
        {
          label: "DNS",
          model: "domainServers",
          type: "input",
          placeholder: "请填写DNS，逗号隔开"
        },
        {
          label: "option 18",
          model: "relayAgentInterfaceId",
          type: "input",
          placeholder: "请填写option 18"
        }
      ];

      if (this.formModel.version === 6) {
        formListResult = ipv6FormList;
      }

      if (this.formModel.version === 4) {
        formListResult = ipv4FormList;
      }

      if (this.isManualCreate) {
        const typeChange = {
          label: "Ip类型",
          model: "version",
          type: "radio",
          placeholder: "请填写默认网关",
          children: [{
            label: 4,
            text: "IPv4"
          },
          {
            label: 6,
            text: "IPv6"
          }]
        };

        formListResult.unshift(typeChange);
      }
      return formListResult;
    },

    isCreate() {
      const { create } = this.links;
      return !!create;
    },

    isManualCreate() {
      const { ipnet } = this.$route.query;

      return this.isCreate && !ipnet;
    }
  },
  watch: {
    visible(val) {
      if (!val) return;
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      if (!val) {
        this.formModel = {
          version: 4,
          subnet: "",
          tags: ""
        };
        // 清楚path的query参数
        const { path } = this.$route;
        this.$router.push({ path });
      } else {
        if (this.isCreate) {
          const { ipnet, tags, networkType } = this.$route.query;
          let version = 4;
          if (ipnet && ipv6IsValid(ipnet)) {
            version = 6;
          }
          if (ipnet && ipv4IsValid(ipnet)) {
            version = 4;
          }
          this.formModel.version = version;


          if (ipnet) {
            this.formModel.subnet = ipnet;
            this.$refs.form.validate();
          } else {
            this.$refs.form.resetFields();
          }

          if (tags) {
            this.formModel.tags = Array.isArray(tags) ? tags.split(",").join(">") : "";
            this.$refs.form.validate();
          }

          if (networkType) {
            this.formModel.networkType = networkType;
          }


        } else {
          this.getData(this.links);
        }
      }
      this.$emit("update:visible", val);
    },
    "formModel.subnet"() {
      this.$refs.form.validate();
    }
  },
  created() {
    this.getNetworkType();
  },

  methods: {
    getData({ self }) {
      this.$get({ url: self }).then(res => {
        resArrayToString(res, ["domainServers", "routers", "relayAgentAddresses"]);
        Object.assign(this.formModel, res);
        this.$refs.form.validate();
      });
    },

    getNetworkType() {
      this.$get({
        url: "/apis/linkingthing.com/ipam/v1/networktypes"
      }).then(({ data }) => {
        this.networkTypeList = data;
      })
    },

    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = { ...this.formModel };

          resStringToArray(params, ["domainServers", "routers", "relayAgentAddresses"]);
          if (this.isCreate) {
            this.$post({ url: this.links.create, params }).then(res => {
              this.$$success("保存成功！");
              this.$emit("success");
              this.dialogVisible = false;

            }).catch(err => {
              this.$$error(err.response.data.message);
            }).finally(() => {
              this.loading = false;
            });
          } else {
            this.$put({ url: this.links.update, params }).then(res => {
              this.$$success("保存成功！");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            }).finally(() => {
              this.loading = false;
            });
          }
        }
      });

    }
  }
};
</script>