<template>
  <modal
    v-model="analysisModal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">修改资源记录</div>
    <div>
      <vue-scroll style="height: 500px;" ref="vs">
        <i-form
          :model="params"
          label-position="right"
          :label-width="500"
          :rules="ruleValidate"
          ref="formValidate"
        >
          <div class="pop-content">
            <div class="pop-box">
              <div class="pop-body" style="padding-bottom:0">
                <form-item label="名称" :label-width="110" prop="name">
                  <i-input v-model="params.name" placeholder="请填写资源名称"></i-input>
                </form-item>
                <form-item label="类型" prop="type" :label-width="110">
                  <i-select v-model="params.type">
                    <i-option value="A">A</i-option>
                    <i-option value="AAAA">AAAA</i-option>
                    <i-option value="CNAME">CNAME</i-option>
                    <i-option value="MX">MX</i-option>
                    <i-option value="NS">NS</i-option>
                    <i-option value="NAPTR">NAPTR</i-option>
                    <i-option value="PTR">PTR</i-option>
                    <i-option value="SRV">SRV</i-option>
                    <i-option value="TXT">TXT</i-option>
                    <i-option value="URL">URL</i-option>
                  </i-select>
                </form-item>
                <form-item label="记录值" :label-width="110" prop="value">
                  <i-input v-model="params.value" placeholder="请填写记录值"></i-input>
                </form-item>
                <form-item label="TTL" prop="ttl" :label-width="110">
                  <i-input type="text" v-model="params.ttl" placeholder="请输入延缓时间" number></i-input>
                </form-item>
                <FormItem label="是否启用" prop="isused" :label-width="110">
                  <RadioGroup v-model="params.isused">
                    <Radio :label="1" isused="1">是</Radio>
                    <Radio :label="0" isused="0">否</Radio>
                  </RadioGroup>
                </FormItem>
              </div>
            </div>
          </div>
        </i-form>
      </vue-scroll>
    </div>
    <div slot="footer">
      <i-button class="me-button k-btn" @click="analysisModal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import services from "@/services";

export default {
  name: "WebsiteUpConfig",
  data() {
    return {
      // 是否显示mode
      analysisModal: false,
      // 表单数据
      params: {
        name: "",
        type: "",
        value: "A",
        ttl: "",
        isused: 1
      },
      viewId: "",
      zoneId: "",
      id: "",

      // 表单验证规则
      ruleValidate: {
        name: [{ required: true, message: "请填写资源名称" }],
        type: [{ required: true, message: "请选择资源类型" }],
        value: [{ required: true }],
        ttl: [{ required: true }],
        isused: [{ required: true }]
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
      setTimeout(() => {
        this.$refs["vs"].scrollTo(
          {
            y: "0"
          },
          0
        );
      }, 0);
    },
    getResourceRecord(viewId, zoneId, id) {
      services.getResourceRecordById(viewId, zoneId, id).then(res => {
        this.params = res.data;
      });
    },
    Modify() {
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