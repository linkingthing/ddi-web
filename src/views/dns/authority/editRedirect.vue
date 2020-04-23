<template>
  <common-modal
    :visible.sync="linkModal"
    title="修改重定向列表"
    @confirm="handleSubmit"
  >
    <i-form
      :model="params"
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
              label="域名"
              :label-width="110"
              prop="name"
            >
              <i-input
                v-model="params.name"
                placeholder="请填写正确域名"
              />
            </form-item>
            <TypeValue :params="params" />
            <form-item
              label="TTL"
              prop="ttl"
              :label-width="110"
            >
              <i-input
                type="number"
                v-model="params.ttl"
                placeholder="请输入延缓时间"
              />
            </form-item>
            <form-item
              label="重定向方式"
              prop="redirecttype"
              :label-width="110"
            >
              <i-select v-model="params.redirecttype">
                <i-option value="rpz">直接重定向</i-option>
                <i-option value="redirect">NXDOMAIN重定向</i-option>
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
  name: "editRedirect",
  components: { TypeValue },
  data() {
    return {
      // 是否显示mode
      linkModal: false,
      // 表单数据
      params: {
        name: "",
        type: "",
        value: "",
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
        type: [
          { required: true, message: "请选择资源类型", trigger: "change" }
        ],
        value: [{ required: true, message: "请填写记录值", trigger: "change" }],
        ttl: [
          {
            required: true,
            type: "number",
            message: "请输入延缓时间",
            trigger: "change"
          },
          positiveIntegerValidate
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
      this.params.ttl = +this.params.ttl;
      services
        .updateRedirect(this.viewId, this.redirectId, this.params)
        .then(res => {
          this.$Message.success("修改成功!");
          this.linkModal = false;
          this.$emit("onSuccess");
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 应用
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.update();
        } else {
          this.$Message.error("修改失败");
        }
      });
    }
  }
};
</script>

<style scoped>
</style>

