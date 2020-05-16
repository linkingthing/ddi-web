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
          message: "请输入正整数",
        },
        {
          validator: function (rule, value, callback) {
            console.log(self.formModel)
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
        maxValidLifetime: [{
          pattern: positiveIntegerReg,
          message: "请输入正整数"
        }],
        minValidLifetime: [{
          pattern: positiveIntegerReg,
          message: "请输入正整数"
        }]
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
        },
        {
          label: "最长租约时长",
          model: "maxValidLifetime",
          type: "number",
          placeholder: "请填写最长租约时长"
        },
        {
          label: "最短租约时长",
          model: "minValidLifetime",
          type: "number",
          placeholder: "请填写最短租约时长"
        },
        {
          label: "DNS",
          model: "domainServers",
          type: "input",
          placeholder: "请填写DNS，逗号隔开"
        },
      ],
    };
  },
  computed: {},
  created() {
    this.$getData().then(([formModel]) => {
      this.formModel = formModel;
    })
  },
  mounted() { },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {

        if (valid) {
          this.$axios.put(this.formModel.links.update, this.formModel).then(res => {
            this.$Message.success("Success!");

          }).catch(err => {
            this.$$error(err.message);
          });
        }
      });
    }
  },
  watch: {},
};
</script>

<style lang="less" >
.dhcp-config-dhcpconfigs {
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