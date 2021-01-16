<template>
  <common-modal
    :width="413"
    :visible.sync="analysisModal"
    title="修改资源记录"
    @confirm="handleSubmit"
    :loading="loading"
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
              <div style="overflow: hidden;word-break: break-all;">
                {{`${params.name}.${recordSuffix}`}}
              </div>
            </form-item>
            <TypeValue
              :params="params"
              :has-all="true"
              :isrrs="true"
              :type-disabled="true"
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
            <form-item
              label="备注"
              prop="comment"
              style="margin-bottom: 0"
            >
              <Input
                v-model="params.comment"
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
  props: {
    recordSuffix: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      // 是否显示mode
      analysisModal: false,
      // 表单数据
      params: {
        name: "",
        rrType: "",
        value: "A",
        ttl: 0,
        comment: ""
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
        rrType: [{ required: true, message: "请选择资源类型" }],
        value: [{ required: true }],
        ttl: [positiveIntegerValidate,
          {
            validator: ttlValidator
          }
        ]
      }
    };
  },

  methods: {
    openModel(viewId, zoneId, id) {
      this.viewId = viewId;
      this.zoneId = zoneId;
      this.id = id;
      this.getResourceRecord(viewId, zoneId, id);
      this.analysisModal = true;
    },

    getResourceRecord(viewId, zoneId, id) {
      services.getResourceRecordById(viewId, zoneId, id).then(data => {
        this.params = data;
      });
    },
    Modify() {
      this.loading = true;
      this.params.ttl = +this.params.ttl;
      services
        .updateResource(this.viewId, this.zoneId, this.id, this.params)
        .then(res => {
          this.analysisModal = false;
          this.$Message.success("修改成功!");
          this.$emit("onEditSuccess");
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
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