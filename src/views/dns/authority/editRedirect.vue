<template>
  <common-modal
    :width="413"
    :visible.sync="linkModal"
    title="修改重定向列表"
    @confirm="handleSubmit"
    :loading="loading"
  >
    <i-form
      :model="params"
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
              <span>{{params.name}}</span>
            </form-item>
            <TypeValue
              :params="params"
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
              label="重定向方式"
              prop="redirecttype"
            >
              <i-select v-model="params.redirecttype">
                <i-option value="localzone">强制重定向</i-option>
                <i-option value="nxdomain">NXDOMAIN</i-option>
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
import { ttlValidator } from "@/util/validator";

export default {
  name: "editRedirect",
  components: { TypeValue },
  data() {
    return {
      loading: false,
      // 是否显示mode
      linkModal: false,
      // 表单数据
      params: {
        name: "",
        rrType: "",
        rdata: "",
        ttl: 0,
        redirecttype: ""
      },
      viewId: "",
      redirectId: "",
      current: {},
      // 表单验证规则
      ruleValidate: {
        name: [
          { required: true, message: "请填写正确的域名", trigger: "change" },
          {
            type: "string",
            max: 253,
            message: "最多只能253个字符"
          },
          nameValidate
        ],
        rrType: [
          { required: true, message: "请选择资源类型", trigger: "change" }
        ],
        value: [{ required: true, message: "请填写记录值", trigger: "change" }],
        ttl: [
          {
            required: true,
            message: "请输入延缓时间"
          },
          positiveIntegerValidate,
          {
            validator: ttlValidator,
          }
        ],
        redirecttype: [
          { required: true, message: "请选择重定向方式", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    openConfig(viewId, redirectId, current) {
      this.viewId = viewId;
      this.redirectId = redirectId;
      this.params = current;
      this.linkModal = true;
    },
    update() {
      this.loading = true;
      this.params.ttl = +this.params.ttl;
      services
        .updateRedirect(this.viewId, this.redirectId, this.params)
        .then(res => {
          this.$Message.success("修改成功!");
          this.linkModal = false;
          this.$emit("onSuccess");
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
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

