<template>
  <common-modal
    :visible.sync="areaModal"
    title="新建区域"
    @confirm="handleSubmit"
  >
    <i-form
      :model="dataConfig"
      label-position="right"
      :label-width="80"
      :rules="ruleValidate"
      ref="formValidate"
    >
      <div class="pop-content">
        <div class="pop-box">
          <div class="pop-body">
            <form-item
              label="名称"
              prop="name"
            >
              <i-input
                v-model="dataConfig.name"
                placeholder="请填区域名称"
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
import { domainValidate } from "@/util/common";

export default {
  name: "AreaAppConfig",
  data() {
    return {
      areaModal: false,
      self: "",
      id: "",
      // 表单数据
      dataConfig: {
        name: "",
        zonetype: "master"
      },
      loading: false,
      // 表单验证规则
      ruleValidate: {
        name: [
          { required: true, message: "请填区域名称" },
          domainValidate
        ]
      }
    };
  },
  methods: {
    openConfig(id2) {
      this.id = id2;
      this.areaModal = true;
    },
    // 新建
    update() {
      services
        .createZone(this.id, this.dataConfig)
        .then(res => {
          this.$Message.success("添加成功!");
          this.cancelModel();
          this.$emit("onCreateSuccess");
        })
        .catch(err => {
          this.$Message.error("添加失败!");
        });
    },
    // 确定
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.update();
        }
      });
    },
    //关闭弹窗
    cancelModel() {
      this.areaModal = false;
      this.$refs.formValidate.resetFields();
    }
  }
};
</script>

<style scoped>
.ivu-divider-dashed {
  border-top: 0px dashed #e8eaec;
}

.ivu-col-span-4 > .ivu-btn {
  padding: 0px 0px;
  border: 0px solid transparent;
  margin-left: 100px;
  color: #4796ff;
}
</style>
