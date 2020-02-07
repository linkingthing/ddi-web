<template>
  <modal
    v-model="alarmlistconfig"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">修改区转发列表</div>
    <div>
      <vue-scroll style="height: 500px;" ref="vs">
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
                <Form-item label="转发方式" prop="type" style="margin-left:20px;">
                  <i-select v-model="dataConfig.type" placeholder="请选择方式">
                    <i-option value="first">first</i-option>
                    <i-option value="only">only</i-option>
                  </i-select>
                </Form-item>
              </div>
            </div>

            <div class="pop-box" style="margin-top:-50px;">
              <div class="pop-body">
                <Form ref="dataConfig" :model="dataConfig" :label-width="102" style="width: 300px">
                  <FormItem
                    v-for="(item, index) in dataConfig.exception"
                    :key="index"
                    :label="'服务器地址' + item.index"
                    :prop="'exception.' + index + '.value'"
                    :rules="{required: true, message: '服务器地址 ' + item.index +'不能为空', trigger: 'blur'}"
                  >
                    <Row>
                      <!-- IP列表 -->
                      <Col span="18">
                        <Input type="text" v-model="item.value" placeholder="请输入IP地址"></Input>
                      </Col>
                      <!-- 删除 -->
                      <Col span="4" offset="1" style="margin-left:16px;">
                        <Button @click="handleRemove(index)">
                          <Icon type="md-trash" />
                        </Button>
                      </Col>
                    </Row>
                  </FormItem>
                </Form>

                <Row>
                  <i-col span="24">
                    <a href="javascript:" class="add-config" @click="handleAdd">+添加服务器地址</a>
                  </i-col>
                </Row>
              </div>
            </div>
          </div>
        </i-form>
      </vue-scroll>
    </div>
    <div slot="footer">
      <i-button class="me-button k-btn" @click="alarmlistconfig = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import services from "@/services";

export default {
  name: "editForward",
  data() {
    return {
      // value:"",
      ips: [],
      index: 1,
      viewId: "",
      zoneId: "",
      alarmlistconfig: false,
      // 表单数据
      dataConfig: {
        type: "",
        // 例外规则
        exception: [
          {
            value: "",
            index: 1
          }
        ]
      },
      loading: false,
      // 表单验证规则
      ruleValidate: {
        type: [{ required: true, message: "转发方式", trigger: "change" }]
      }
    };
  },
  methods: {
    openModel(viewId, zoneId, current) {
      this.viewId = viewId;
      this.zoneId = zoneId;
      this.alarmlistconfig = true;
      this.dataConfig.type = current.type;
      if (Array.isArray(current.ips)) {
        this.dataConfig.exception = current.ips.map((value, index) => ({
          value,
          index: index + 1
        }));
        this.index = current.ips.length;
      } else {
        this.dataConfig = {
          type: "",
          // 例外规则
          exception: [
            {
              value: "",
              index: 1
            }
          ]
        };
      }
    },
    //新建
    getModify() {
      services
        .updateForward(this.viewId, this.zoneId, {
          oper: "MOD",
          type: this.dataConfig.type,
          ips: this.dataConfig.exception
            .map(item => item.value)
            .filter(item => item)
        })
        .then(res => {
          this.$Message.success("修改成功!");
          this.cancelModel();
          this.$emit("onSuccess");
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 确定
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.getModify();
        } else {
          this.$Message.error("修改失败!");
        }
      });
    },
    //    添加IP地址
    handleAdd() {
      this.index++;
      this.dataConfig.exception.push({
        value: "",
        index: this.index,
        status: 1
      });
    },
    handleRemove(index) {
      this.dataConfig.exception.splice(index, 1);
    },
    //关闭弹窗
    cancelModel() {
      this.alarmlistconfig = false;
      this.$refs.formValidate.resetFields();
      this.dataConfig = {
        type: "",
        // 例外规则
        exception: [
          {
            value: "",
            index: 1
          }
        ]
      };
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
