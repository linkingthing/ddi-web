<template>
  <modal
    v-model="restrictModal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">新建A4合成地址列表</div>
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
                <form-item label="前缀" :label-width="110" prop="prefix">
                  <i-input v-model="params.prefix" placeholder="请填写前缀"></i-input>
                </form-item>
                <form-item label="客户IP地址" prop="clientacl" :label-width="110">
                  <i-select v-model="params.clientacl">
                    <i-option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</i-option>
                  </i-select>
                </form-item>

                <form-item label="目标IPv4地址" prop="aaddress" :label-width="110">
                  <i-select v-model="params.aaddress">
                    <i-option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</i-option>
                  </i-select>
                </form-item>
              </div>
            </div>
          </div>
        </i-form>
      </vue-scroll>
    </div>
    <div slot="footer">
      <i-button class="me-button k-btn" @click="restrictModal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import services from "@/services";

export default {
  name: "createA4",
  data() {
    return {
      // 是否显示mode
      restrictModal: false,
      list: [],
      viewId: "",
      // 表单数据
      params: {
        prefix: "",
        clientacl: "",
        aaddress: ""
      },
      // 表单验证规则
      ruleValidate: {
        prefix: [
          { required: true, message: "请填正确的地址前缀", trigger: "change" }
        ],
        clientacl: [
          { required: true, message: "请选择客户IP地址", trigger: "change" }
        ],
        aaddress: [
          { required: true, message: "请选择目标IPv4地址", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.getChoose();
  },
  methods: {
    openConfig(viewId) {
      this.viewId = viewId;
      this.restrictModal = true;
      setTimeout(() => {
        this.$refs["vs"].scrollTo(
          {
            y: "0"
          },
          0
        );
      }, 0);
    },
    getChoose() {
      services
        .getAccessList()
        .then(res => {
          this.list = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    update() {
      services
        .createDNS64(this.viewId, this.params)
        .then(res => {
          this.restrictModal = false;
          this.$emit("onCreateSuccess");
          this.$Message.success("新建成功!");
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
