<template>
  <div class="dhcp-config-dhcpconfigs">
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

      <div class="btn-submit">
        <Button
          v-if="$hasPermissionCreate('dhcpconfig')"
          type="primary"
          @click="handleSubmit('formInline')"
        >确认</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { positiveIntegerReg } from "@/util/common";

export default {
  components: {},
  props: {},
  data() {
    const self = this;
    return {
      rules: {
        validLifetime: [{
          pattern: positiveIntegerReg,
          message: "请输入正整数"
        },
        {
          validator: function (rule, value, callback) {
            if (value > self.formModel.maxValidLifetime) {
              callback("租约时长不能大于最长租约时长");
            }
            if (value < self.formModel.minValidLifetime) {
              callback("租约时长不能小于最短租约时长");
            }
            callback();
          }
        }
        ],
        maxValidLifetime: [
          {
            pattern: positiveIntegerReg,
            message: "请输入正整数"
          },
          {
            validator: function (rule, value, callback) {
              if (value > 604800) {
                callback("最大租约时长不能大于604800");
              }
              callback();
            }
          }
        ],
        minValidLifetime: [
          {
            pattern: positiveIntegerReg,
            message: "请输入正整数"
          },
          {
            validator: function (rule, value, callback) {
              if (value < 3600) {
                callback("最短租约时长不能小于3600");
              }
              callback();
            }
          }
        ]
      },
      formModel: {
        validLifetime: 0,
        maxValidLifetime: 0,
        minValidLifetime: 0,
        domainServers: ""
      },
      formItemList: [
        {
          label: "租约时长",
          model: "validLifetime",
          type: "number",
          placeholder: "请填写租约时长",
          extra: "秒"
        },
        {
          label: "最长租约时长",
          model: "maxValidLifetime",
          type: "number",
          placeholder: "请填写最长租约时长",
          extra: "秒"
        },
        {
          label: "最短租约时长",
          model: "minValidLifetime",
          type: "number",
          placeholder: "请填写最短租约时长",
          extra: "秒"
        },
        {
          label: "DNS",
          model: "domainServers",
          type: "input",
          placeholder: "请填写DNS，逗号隔开"
        }
      ]
    };
  },
  computed: {},
  created() {
    this.$getData().then(({ data: [formModel] }) => {
      this.formModel = formModel;
      if (Array.isArray(formModel.domainServers)) {
        this.formModel.domainServers = formModel.domainServers.join(",");
      } else {
        this.formModel.domainServers = "";
      }
    });
  },
  mounted() { },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {

        if (valid) {
          const params = { ...this.formModel };

          if (!Array.isArray(params.domainServers)) {
            params.domainServers = (typeof params.domainServers === "string" && params.domainServers.length) ? params.domainServers.split(",") : [];
          }


          this.$axios.put(this.formModel.links.update, params).then(res => {
            this.$Message.success("保存成功!");

          }).catch(err => {
            this.$$error(err.response.data.message);
          });
        }
      });
    }
  }
};
</script>

<style lang="less" >
.dhcp-config-dhcpconfigs {
  width: 1200px;
  padding-top: 80px;
  padding-left: 26px;

  .ivu-form-item {
    float: left;
    width: 400px;
    margin-right: 90px;
  }

  .btn-submit {
    clear: both;
  }
}
</style>