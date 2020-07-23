<template>
  <common-modal
    :width="413"
    :visible.sync="analysisModal"
    title="修改资源记录"
    @confirm="handleSubmit"
  >
    <i-form
      :model="params"
      label-position="right"
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
              label="记录名"
              prop="name"
            >
              {{`${params.name}.${recordSuffix}`}}
            </form-item>
            <TypeValue
              :params="params"
              :has-all="true"
              :isrrs="true"
            />
            <form-item
              label="TTL"
              prop="ttl"
            >
              <Input
                v-model="params.ttl"
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
import TypeValue from "@/components/TypeValue";
import {
  resourceDomainValidateFunc,
  positiveIntegerValidate
} from "@/util/common";
import { getParantData } from "@/util/request";
import { ttlValidator } from "@/util/validator";

export default {
  name: "WebsiteUpConfig",
  components: { TypeValue },
  data() {
    return {
      recordSuffix: "",
      // 是否显示mode
      analysisModal: false,
      // 表单数据
      params: {
        name: "",
        datatype: "",
        value: "A",
        ttl: 0
      },
      viewId: "",
      zoneId: "",
      id: "",

      // 表单验证规则
      ruleValidate: {
        name: [
          { required: true, message: "请填写资源名称" },
          {
            validator: resourceDomainValidateFunc
          }
        ],
        datatype: [{ required: true, message: "请选择资源类型" }],
        value: [{ required: true }],
        ttl: [positiveIntegerValidate,
          {
            validator: ttlValidator
          }
        ]
      }
    };
  },
  created() {
    this.getZoneInfo();
  },
  methods: {
    openModel(viewId, zoneId, id) {
      this.viewId = viewId;
      this.zoneId = zoneId;
      this.id = id;
      this.getResourceRecord(viewId, zoneId, id);
      this.analysisModal = true;
    },
    getZoneInfo() {
      getParantData().then(({ data: { name } }) => {
        this.recordSuffix = name;
      });
    },
    getResourceRecord(viewId, zoneId, id) {
      services.getResourceRecordById(viewId, zoneId, id).then(res => {
        this.params = res.data;
      });
    },
    Modify() {
      this.params.ttl = +this.params.ttl;
      services
        .updateResource(this.viewId, this.zoneId, this.id, this.params)
        .then(res => {
          this.analysisModal = false;
          this.$Message.success("修改成功!");
          this.$emit("onEditSuccess");
        })
        .catch(err => {
          this.$Message.error("修改失败！");
        });
    },
    // 应用
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.Modify();
        }
      });
    }
  }
};
</script>

<style scoped>
</style>