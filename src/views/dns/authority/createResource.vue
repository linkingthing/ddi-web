<template>
  <common-modal
    :visible.sync="configModal"
    :width="413"
    title="新建资源记录"
    @confirm="handleSubmit"
  >
    <i-form
      :model="upgradeConfig"
      label-position="left"
      :label-width="80"
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
              label="记录名"
              prop="name"
            >
              <i-input
                v-model="upgradeConfig.name"
                placeholder="请填写资源名称"
              >
                <span slot="append">{{recordSuffix}}</span>
              </i-input>
            </form-item>
            <ResourceTypeValue :params="upgradeConfig" />
            <form-item
              label="TTL"
              prop="ttl"
              style="margin-bottom: 0"
            >
              <InputNumber
                :max="24*60*60"
                v-model="upgradeConfig.ttl"
                placeholder="请输入延缓时间"
                style="width: 100%"
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
import { getParantData } from "@/util/request";
import ResourceTypeValue from "@/components/ResourceTypeValue";

export default {
  name: "createResource",
  components: {
    ResourceTypeValue
  },
  data() {
    return {
      recordSuffix: "",
      // 是否显示mode
      configModal: false,
      // 表单数据
      upgradeConfig: {
        name: "",
        datatype: "A",
        rdata: "",
        ttl: 3600
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
        datatype: [{ required: true, message: "请选择资源类型" }],
        rdata: [{ required: true, message: "请填写记录值" }],
        ttl: [positiveIntegerValidate]
      }
    };
  },
  watch: {
    configModal(val) {
      if (!val) {
        this.$refs.formValidate.resetFields();
      }
    }
  },
  methods: {
    openConfig(viewId, zoneId) {
      this.viewId = viewId;
      this.zoneId = zoneId;
      this.configModal = true;
      this.getZoneInfo();
    },
    getZoneInfo() {
      getParantData().then(({ data: { name } }) => {
        this.recordSuffix = name;
      });
    },
    update() {
      const rdataList = this.upgradeConfig.rdata.split(",");
      console.log(rdataList)
      rdataList.forEach(rdata => {
        const params = { ...this.upgradeConfig, rdata: rdata.trim() };
        services
          .createResourceRecord(this.viewId, this.zoneId, params)
          .then(() => {
            this.$Message.success("新建成功!");
            this.configModal = false;
            this.$refs.formValidate.resetFields();
            this.$emit("onCreateSuccess");
          })
          .catch((err) => {
            this.$Message.error(err.response.data.message);
          });
      })

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
