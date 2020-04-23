<template>
  <common-modal
    :visible.sync="configModal"
    title="新建资源记录"
    @confirm="handleSubmit"
  >
    <i-form
      :model="upgradeConfig"
      label-position="right"
      :label-width="500"
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
              label="名称"
              :label-width="110"
              prop="name"
            >
              <i-input
                v-model="upgradeConfig.name"
                placeholder="请填写资源名称"
              />
            </form-item>
            <TypeValue :params="upgradeConfig" />
            <form-item
              label="TTL"
              prop="ttl"
              :label-width="110"
            >
              <i-input
                type="text"
                v-model="upgradeConfig.ttl"
                placeholder="请输入延缓时间"
                number
              />
            </form-item>
          </div>
        </div>
      </div>
    </i-form>
  </common-modal>
</template>

<script>
import services from "@/services";
import { resourceDomainValidateFunc, positiveIntegerValidate } from "@/util/common";
import TypeValue from "@/components/TypeValue";

export default {
  name: "createResource",
  components: {
    TypeValue
  },
  data() {
    return {
      // 是否显示mode
      configModal: false,
      // 表单数据
      upgradeConfig: {
        title: "",
        name: "",
        type: "A",
        value: "",
        ttl: ""
      },
      viewId: "",
      zoneId: "",
      // 表单验证规则
      ruleValidate: {
        name: [
          { required: true, message: "请填写资源名称" },
          {
            validator: resourceDomainValidateFunc
          }
        ],
        type: [{ message: "请选择资源类型" }],
        value: [{ required: true, message: "请填写记录值" }],
        ttl: [{ required: true, message: "请填写ttl" }, positiveIntegerValidate]
      }
    };
  },
  methods: {
    openConfig(viewId, zoneId) {
      this.viewId = viewId;
      this.zoneId = zoneId;
      this.configModal = true;
    },
    update() {
      services
        .createResourceRecord(this.viewId, this.zoneId, {
          name: this.upgradeConfig.name,
          type: this.upgradeConfig.type,
          value: this.upgradeConfig.value,
          ttl: this.upgradeConfig.ttl,
          isused: this.upgradeConfig.isused
        })
        .then(() => {
          this.$Message.success("新建成功!");
          this.configModal = false;
          this.$refs.formValidate.resetFields();
          this.$emit("onCreateSuccess");
        })
        .catch(() => {
          this.$Message.error("新建失败");
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
