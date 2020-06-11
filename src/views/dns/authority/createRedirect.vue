<template>
  <common-modal
    :width="413"
    :visible.sync="ipModal"
    title="新建重定向列表"
    @confirm="handleSubmit"
  >
    <i-form
      :model="upgradeConfig"
      label-position="left"
      :label-width="100"
      :rules="ruleValidate"
      ref="formValidate"
    >
      <div class="pop-content">
        <div class="pop-box">
          <div
            class="pop-body"
            style="padding-bottom:0"
          >
            <form-item
              label="域名"
              prop="name"
            >
              <i-input
                v-model="upgradeConfig.name"
                placeholder="请填写正确域名"
              />
            </form-item>
            <TypeValue :params="upgradeConfig" />
            <form-item
              label="TTL"
              prop="ttl"
            >
              <InputNumber
                :max="24*60*60"
                v-model="upgradeConfig.ttl"
                placeholder="请输入延缓时间"
                style="width: 100%"
              />
            </form-item>
            <form-item
              label="重定向方式"
              prop="redirecttype"
            >
              <i-select v-model="upgradeConfig.redirecttype">
                <i-option value="localzone">强制重定向</i-option>
                <i-option value="nxdomain">nxdomain</i-option>
              </i-select>
            </form-item>
          </div>
        </div>
      </div>
    </i-form>
  </common-modal>
</template>

<script>
import services from "@/services";
import TypeValue from "@/components/TypeValue";
import { nameValidate, positiveIntegerValidate } from "@/util/common";

export default {
  name: "createRedirect",
  components: { TypeValue },
  data() {
    return {
      // 是否显示mode
      ipModal: false,
      // 表单数据
      upgradeConfig: {
        name: "",
        datatype: "A",
        rdata: "",
        ttl: 3600,
        redirecttype: "localzone"
      },
      viewId: "",

      // 表单验证规则
      ruleValidate: {
        name: [
          { required: true, message: "请填写正确的域名" },
          {
            type: "string",
            max: 253,
            message: "最多只能253个字符"
          },
          nameValidate
        ],
        datatype: [{ required: true, message: "请选择资源类型" }],
        ttl: [
          { required: true, message: "请输入TTL" },
          positiveIntegerValidate
        ],
        redirecttype: [{ required: true, message: "请选择重定向方式" }]
      }
    };
  },
  methods: {
    openConfig(viewId) {
      this.viewId = viewId;
      this.$refs.formValidate.resetFields();
      this.ipModal = true;
    },
    update() {
      const params = this.upgradeConfig;
      params.ttl = +params.ttl;
      services
        .createRedirect(this.viewId, params)
        .then(() => {
          this.$emit("onCreateSuccess");
          this.$Message.success("新建成功!");
          this.ipModal = false;
          this.$refs.formValidate.resetFields();
        })
        .catch((err) => {
          console.log(err)
          this.$Message.error(err.message);
        });
    },
    // 应用
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.update();
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
