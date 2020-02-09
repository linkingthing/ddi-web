<template>
  <modal
    v-model="ipModal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">新建重定向列表</div>
    <div>
      <vue-scroll style="height: 500px;" ref="vs">
        <i-form
          :model="upgradeConfig"
          label-position="right"
          :label-width="500"
          :rules="ruleValidate"
          ref="formValidate"
        >
          <div class="pop-content">
            <div class="pop-box">
              <div class="pop-body" style="padding-bottom:0">
                <form-item label="域名" :label-width="110" prop="t1">
                  <i-input v-model="upgradeConfig.t1" placeholder="请填写正确域名"></i-input>
                </form-item>
                <form-item label="类型" prop="t2" :label-width="110">
                  <i-select v-model="upgradeConfig.t2">
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
                <form-item label="记录值" :label-width="110" prop="t3">
                  <i-input v-model="upgradeConfig.t3" placeholder="请填写记录值"></i-input>
                </form-item>
                <form-item label="TTL" prop="t4" :label-width="110">
                  <i-input type="number" v-model="upgradeConfig.t4" placeholder="请输入延缓时间"></i-input>
                </form-item>
                <form-item label="重定向方式" prop="redirecttype" :label-width="110">
                  <i-select v-model="upgradeConfig.redirecttype">
                    <i-option value="rpz">直接重定向</i-option>
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
      <i-button class="me-button k-btn" @click="ipModal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import services from "@/services";

export default {
  name: "createRedirect",
  data() {
    return {
      // 是否显示mode
      ipModal: false,
      // 表单数据
      upgradeConfig: {
        title: "",
        t1: "",
        t2: "A",
        t3: "",
        t4: 0,
        redirecttype: ""
      },
      viewId: "",

      // 表单验证规则
      ruleValidate: {
        t1: [
          { required: true, message: "请填写正确的域名", trigger: "change" }
        ],
        t2: [{ required: true, message: "请选择资源类型", trigger: "change" }],
        t3: [{ required: true, message: "请选输入记录值", trigger: "change" }],
        t4: [{ required: true, message: "请输入TTL", trigger: "change" }],
        redirecttype: [
          { required: true, message: "请选择重定向方式", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    openConfig(viewId) {
      this.viewId = viewId;
      this.ipModal = true;
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
      services
        .createRedirect(this.viewId, {
          name: this.upgradeConfig.t1,
          datatype: this.upgradeConfig.t2,
          value: this.upgradeConfig.t3,
          ttl: +this.upgradeConfig.t4,
          redirecttype: this.upgradeConfig.redirecttype
        })
        .then(res => {
          this.$emit("onCreateSuccess");
          this.$Message.success("新建成功!");
          this.ipModal = false;
        })
        .catch(err => {
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
