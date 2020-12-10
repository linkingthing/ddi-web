<template>
  <common-modal
    :visible.sync="dialogVisible"
    :width="415"
    title="网络探测"
    @confirm="handleConfirm"
    :loading="loading"
  >

    <Form
      :label-width="100"
      ref="form"
      :model="params"
      :rules="rules"
    >
      <FormItem
        label="是否开启"
        prop="snmpEnabled"
      >
        <i-switch v-model="params.snmpEnabled">
          <span slot="open">开</span>
          <span slot="close">关</span>
        </i-switch>
      </FormItem>

      <FormItem
        label="SNMP 版本"
        prop="snmpVersion"
      >
        <RadioGroup v-model="params.snmpVersion">
          <Radio label="v2c">SNMPV2</Radio>
          <Radio label="v3">SNMPV3</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem
        label="SNMP团体名"
        prop="snmpCommunity"
      >
        <Input
          v-model="params.snmpCommunity"
          placeholder="请输入SNMP团体名"
        />
      </FormItem>

      <template v-if="params.snmpVersion === 'v3'">
        <FormItem
          label="用户名称"
          prop="snmpV3UserName"
        >
          <Input
            v-model="params.snmpV3UserName"
            placeholder="请输入用户名称"
          />

        </FormItem>

        <FormItem
          label="安全级别"
          prop="snmpV3MsgFlag"
        >
          <Select v-model="params.snmpV3MsgFlag">
            <Option
              v-for="item in securityLevel"
              :value="item.value"
              :key="item.value"
            >{{item.label}}</Option>
          </Select>
        </FormItem>

        <template v-if="params.snmpV3MsgFlag !== 'no_auth_no_priv'">
          <FormItem
            label="认证协议"
            prop="snmpV3AuthenticationProtocol"
          >
            <Select v-model="params.snmpV3AuthenticationProtocol">
              <Option
                v-for="item in authenticationProtocolList"
                :value="item.value"
                :key="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>

          <FormItem
            label="认证密码"
            prop="snmpV3AuthenticationPassphrase"
          >
            <Input
              v-model="params.snmpV3AuthenticationPassphrase"
              placeholder="请输入认证密码"
            />
          </FormItem>

          <template v-if="params.snmpV3MsgFlag === 'auth_priv'">
            <FormItem
              label="加密协议"
              prop="snmpV3PrivacyProtocol"
            >
              <Select v-model="params.snmpV3PrivacyProtocol">
                <Option
                  v-for="item in snmpV3PrivacyProtocolList"
                  :value="item.value"
                  :key="item.value"
                >{{item.label}}</Option>
              </Select>
            </FormItem>

            <FormItem
              label="加密密码"
              prop="snmpV3PrivacyPassphrase"
            >
              <Input
                v-model="params.snmpV3PrivacyPassphrase"
                placeholder="请输入加密密码"
              />
            </FormItem>

          </template>

        </template>

      </template>
    </Form>

  </common-modal>
</template>

<script>
import { portIsValidate } from "@/util/common";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      default: () => null
    }
  },

  data() {
    this.securityLevel = [
      {
        label: "不认证不加密",
        value: "no_auth_no_priv"
      }, {
        label: "认证不加密",
        value: "auth_no_priv"
      }, {
        label: "认证且加密",
        value: "auth_priv"
      }
    ];

    this.authenticationProtocolList = [
      {
        label: "MD5",
        value: "MD5"
      },
      {
        label: "SHA",
        value: "SHA"
      },
      // {
      //   label: "SHA224",
      //   value: "SHA224"
      // },
      // {
      //   label: "SHA256",
      //   value: "SHA256"
      // },
      // {
      //   label: "SHA384",
      //   value: "SHA384"
      // },
      // {
      //   label: "SHA512",
      //   value: "SHA512"
      // }
    ];

    this.snmpV3PrivacyProtocolList = [
      {
        label: "DES",
        value: "DES"
      },
      {
        label: "AES",
        value: "AES"
      },
      // {
      //   label: "AES192",
      //   value: "AES192"
      // },
      // {
      //   label: "AES256",
      //   value: "AES256"
      // },
      // {
      //   label: "AES192C",
      //   value: "AES192C"
      // },
      // {
      //   label: "AES256C",
      //   value: "AES256C"
      // }
    ];


    return {
      loading: false,
      dialogVisible: false,
      isEdit: false,
      url: this.$getApiByRoute().url,


      params: {
        snmpPort: 161,
        snmpCommunity: "",
        snmpEnabled: false,
        snmpV3AuthenticationPassphrase: "",
        snmpV3AuthenticationProtocol: "",
        snmpV3MsgFlag: "",
        snmpV3PrivacyPassphrase: "",
        snmpV3PrivacyProtocol: "",
        snmpV3UserName: "",
        snmpVersion: "v2c"
      }
    };
  },

  computed: {
    rules() {
      const self = this;
      return {
        snmpV3UserName: [{
          required: true, message: "用户名必填"
        }],
        snmpCommunity: [{
          required: self.params.snmpEnabled, message: "SNMP团体名必填"
        }],
        snmpV3AuthenticationProtocol: [{
          required: true, message: "认证协议必填"
        }],
        snmpV3AuthenticationPassphrase: [{
          required: true, message: "认证密码必填"
        }],
        snmpV3PrivacyProtocol: [{
          required: true, message: "加密协议必填"
        }],
        snmpV3PrivacyPassphrase: [{
          required: true, message: "加密密码必填"
        }]
      };
    }
  },

  watch: {
    visible(val) {
      if (!val) return;

      this.dialogVisible = val;
    },

    dialogVisible(val) {
      if (!val) {
        this.$refs.form.resetFields();
      }

      this.$emit("update:visible", val);
    },

    data: {
      immediate: true,
      handler(val) {
        this.isEdit = val && Object.keys(val).length;

        if (this.isEdit) {
          Object.keys(this.params).forEach(item => {
            this.params[item] = val[item];
          });
        }
      }
    }
  },

  methods: {

    handleConfirm() {

      this.$refs.form.validate(valid => {

        if (valid) {
          this.loading = true;
          let url = this.url + "/" + this.data.id + "?action=snmp";
          const params = this.params;

          this.$post({ url, params }).then(() => {
            this.$Message.success("保存成功");
            this.$emit("saved");
            this.dialogVisible = false;
            this.loading = false;
          }).catch(err => {
            this.loading = false;
            this.$Message.error(err.response.data.message);
          });
        }
      });


    }

  }
};
</script>

<style lang="less">
@import "./index.less";
</style>