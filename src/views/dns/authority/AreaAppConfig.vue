<template>
  <modal
    v-model="areaModal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">新建区域</div>
    <div>
      <vue-scroll ref="vs">
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
                <Row>
                  <i-col span="18">
                    <form-item label="名称" prop="name">
                      <i-input v-model="dataConfig.name" placeholder="请填区域名称"></i-input>
                    </form-item>
                  </i-col>
                </Row>
                <FormItem label="是否启用" prop="isused" style="margin-left:28px;">
                  <RadioGroup v-model="dataConfig.isused">
                    <Radio label="1" :value="1">是</Radio>
                    <Radio label="0" :value="0">否</Radio>
                  </RadioGroup>
                </FormItem>
              </div>
            </div>
          </div>
        </i-form>
      </vue-scroll>
    </div>
    <div slot="footer">
      <i-button class="me-button k-btn" @click="areaModal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import { isURL, isNumber, isEmpty } from "@/util/common";
import services from "@/services";

export default {
  name: "AreaAppConfig",
  data() {
    // 校验配置组名
    const validator1 = (rule, value, callback) => {
      var name = /^[a-zA-Z0-9_]{1,}$/;
      if (!isEmpty(value)) {
        callback(new Error("请输入控制表名(字母和数字)"));
      } else {
        if (!value.match(name)) {
          callback(new Error("请正确输入控制表名(字母和数字)"));
        } else {
          if (isNumber(value.substr(0, 1))) {
            callback(new Error("控制表名不能以数字开头"));
          }
          callback();
        }
      }
    };
    return {
      areaModal: false,
      self: "",
      id: "",
      // 表单数据
      dataConfig: {
        name: "",
        isused: ""
      },
      loading: false,
      // 表单验证规则
      ruleValidate: {
        name: [{ required: true, validator: validator1, trigger: "blur" }]
      }
    };
  },
  methods: {
    openConfig(id2) {
      this.id = id2;
      this.areaModal = true;
    },
    //新建
    update() {
      console.log(1)
      services
        .createZone(id2, this.dataConfig)
        .then(res => {
          this.$Message.success("添加成功!");
          this.cancelModel();
        })
        .catch(err => {
          this.$Message.error("添加失败!");
        });
    },
    // 确定
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          console.log(valid)
          this.update();
        }
      });
    },
    //关闭弹窗
    cancelModel() {
      this.deviceModal = false;
      this.$refs.formValidate.resetFields();
    }
  }
};
</script>

<style scoped>
.ivu-divider-dashed {
  /* background: 0 0; */
  border-top: 0px dashed #e8eaec;
}

.ivu-col-span-4 > .ivu-btn {
  padding: 0px 0px;
  border: 0px solid transparent;
  margin-left: 100px;
  color: #4796ff;
}
</style>
