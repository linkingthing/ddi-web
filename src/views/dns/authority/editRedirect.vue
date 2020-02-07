<template>
  <modal
    v-model="linkModal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">修改重定向列表</div>
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
              <!-- <p class="title">应用域名</p> -->
              <div class="pop-body" style="padding-bottom:0">
                <form-item label="域名" :label-width="110" prop="name">
                  <i-input v-model="params.name" placeholder="请填写正确域名"></i-input>
                </form-item>
                <form-item label="类型" prop="datatype" :label-width="110">
                  <i-select v-model="params.datatype">
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
                  <i-input type="number" v-model="params.ttl" placeholder="请输入延缓时间"></i-input>
                </form-item>
                <form-item label="重定向方式" prop="redirecttype" :label-width="110">
                  <i-select v-model="params.redirecttype">
                    <i-option value="rpc">直接重定向</i-option>
                    <i-option value="redirect">NXDOMAIN重定向</i-option>
                  </i-select>
                </form-item>
              </div>
            </div>
          </div>
        </i-form>
      </vue-scroll>
    </div>
    <div slot="footer">
      <i-button class="me-button k-btn" @click="linkModal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import services from "@/services";

export default {
  name: "editRedirect",
  data() {
    return {
      // 是否显示mode
      linkModal: false,
      // 表单数据
      params: {
        name: "",
        datatype: "",
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
          { required: true, message: "请填写正确的域名", trigger: "change" }
        ],
        datatype: [
          { required: true, message: "请选择资源类型", trigger: "change" }
        ],
        value: [{ required: true, message: "请填写记录值", trigger: "change" }],
        ttl: [{ required: true, message: "请输入延缓时间", trigger: "change" }],
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
      setTimeout(() => {
        this.$refs["vs"].scrollTo(
          {
            y: "0"
          },
          0
        );
      }, 0);
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

