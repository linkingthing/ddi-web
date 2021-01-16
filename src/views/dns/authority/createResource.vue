<template>
  <common-modal
    :visible.sync="configModal"
    :width="413"
    title="新建资源记录"
    @confirm="handleSubmit"
    :loading="loading"
  >
    <i-form
      :model="upgradeConfig"
      label-position="left"
      :label-width="100"
      :rules="ruleValidate"
      ref="formValidate"
      class="rrs-modal"
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
                :title="recordSuffix"
              >
                <span slot="append">.{{recordSuffix.length > 20 ? `${recordSuffix.slice(-20)}...` : recordSuffix }}</span>
              </i-input>
            </form-item>
            <TypeValue
              :params="upgradeConfig"
              :has-all="true"
              :isrrs="true"
            />
            <form-item
              label="启用"
              prop="enabled"
            >
              <bool-radio
                v-model="upgradeConfig.enabled"
                :children="boolRadioChildren"
                style="width: 100%"
              />
            </form-item>
            <form-item
              label="TTL"
              prop="ttl"
            >
              <Input
                v-model="upgradeConfig.ttl"
                placeholder="请输入延缓时间"
                style="width: 100%"
              />
            </form-item>
            <form-item
              label="备注"
              prop="comment"
              style="margin-bottom: 0"
            >
              <Input
                v-model="upgradeConfig.comment"
                placeholder="请输入备注"
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
import TypeValue from "@/components/TypeValue";
import { ttlValidator } from "@/util/validator";

export default {
  name: "createResource",
  components: {
    TypeValue
  },
  props: {
    recordSuffix: {
      type: String,
      default: ""
    }
  },
  data() {

    this.boolRadioChildren = [{
      value: true,
      label: "开启"
    }, {
      value: false,
      label: "关闭"
    }];
    return {
      loading: false,
      // 是否显示mode
      configModal: false,
      // 表单数据
      tempttl: "",
      upgradeConfig: {
        name: "",
        rrType: "A",
        rdata: "",
        rdataBackup: "",
        ttl: 0,
        enabled: true,
        comment: ""
      },
      viewId: "",
      zoneId: "",
      // 表单验证规则
      ruleValidate: {
        name: [
          { required: true, message: "请填写资源名称" },
          {
            validator: (rule, value, callback) => {

              let recordSuffix = this.recordSuffix;
              if (recordSuffix === "@") {
                recordSuffix = "";
              }
              resourceDomainValidateFunc(rule, {
                item: value,
                all: `${value}.${recordSuffix}`
              }, callback);
            }
          }
        ],
        rrType: [{ required: true, message: "请选择资源类型" }],
        rdata: [{ required: true, message: "请填写记录值" }],
        ttl: [positiveIntegerValidate, {
          validator: ttlValidator
        }]
      }
    };
  },
  watch: {
    configModal(val) {
      if (!val) {
        this.$refs.formValidate.resetFields();
        this.getGlobalConfig();
        this.upgradeConfig.ttl = this.tempttl;
      }
    }
  },
  methods: {
    getGlobalConfig() {
      this.$getData({}, "/dns/dns/dnsglobalconfigs").then(({ data: [res] }) => {
        this.upgradeConfig.ttl = res.ttl;
        this.tempttl = res.ttl;
      }).catch(() => {
        console.log("全局配置获取失败");
      })
    },
    openConfig(viewId, zoneId) {
      this.viewId = viewId;
      this.zoneId = zoneId;
      this.configModal = true;
      this.getGlobalConfig();
    },
    update() {
      this.loading = true;
      const rdataList = this.upgradeConfig.rdata.split(",");
      rdataList.forEach(rdata => {
        const params = { ...this.upgradeConfig, rdata: rdata.trim() };
        params.ttl = +params.ttl;
        services
          .createResourceRecord(this.viewId, this.zoneId, params)
          .then(() => {
            this.$Message.success("新建成功!");
            this.configModal = false;
            this.$refs.formValidate.resetFields();
            this.$emit("onCreateSuccess");
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
            this.$Message.error(err.response.data.message);
          });
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

<style>
.rrs-modal .ivu-radio-wrapper {
  margin-right: 34px;
}
</style>
