<template>
  <modal
    v-model="configModal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">新建访问控制表</div>
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
                <Row>
                  <i-col span="18">
                    <form-item label="名称" prop="name">
                      <i-input v-model="dataConfig.name" placeholder="请填访问控制名称"></i-input>
                    </form-item>
                    <form-item label="acls" prop="acls">
                      <Select filterable multiple v-model="dataConfig.acls">
                        <Option
                          v-for="item in accessList"
                          :key="item.id"
                          :value="item.name"
                        >{{item.name}}</Option>
                      </Select>
                    </form-item>
                  </i-col>
                </Row>
              </div>
            </div>

            <div class="pop-box" style="margin-top:-50px;">
              <div class="pop-body">
                <Form ref="dataConfig" :model="dataConfig" :label-width="80" style="width: 300px">
                  <FormItem
                    v-for="(item, index) in dataConfig.exception"
                    :key="index"
                    :label="'IP列表' + item.index"
                    :prop="'exception.' + index + '.value'"
                    :rules="{required: true, message: 'IP列表 ' + item.index +'不能为空', trigger: 'blur'}"
                  >
                    <Row>
                      <!-- IP列表 -->
                      <Col span="18">
                        <Input type="text" v-model="item.value" placeholder="请输入IP地址"></Input>
                      </Col>
                      <!-- 删除 -->
                      <Col span="4" offset="1">
                        <Button @click="handleRemove(index)">
                          <Icon type="md-trash" />
                        </Button>
                      </Col>
                    </Row>
                  </FormItem>
                </Form>

                <Row>
                  <i-col span="24">
                    <a href="javascript:" class="add-config" @click="handleAdd">+添加IP地址</a>
                  </i-col>
                </Row>
              </div>
            </div>
          </div>
        </i-form>
      </vue-scroll>
    </div>
    <div slot="footer">
      <i-button class="me-button k-btn" @click="configModal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import services from "@/services";
export default {
  name: "ConfigGroupMgConfig",
  props: ["accessList"],
  data() {
    return {
      value: "",
      IP: [],
      acls: [],
      index: 1,
      configModal: false,
      // 表单数据
      dataConfig: {
        title: "",
        name: "",
        // 例外规则
        exception: [
          {
            value: "",
            index: 1,
            status: 1
          }
        ]
      },
      loading: false,
      // 表单验证规则
      ruleValidate: {
        name: [{ required: true, message: "请填访问控制名称" }]
      }
    };
  },
  methods: {
    openConfig() {
      this.configModal = true;
    },
    //新建
    update() {
      let _self = this;
      for (var key in this.dataConfig.exception) {
        _self.value = _self.dataConfig.exception[key].value;
        _self.IP.push(_self.value);
      }
      services
        .createAccess({
          name: this.dataConfig.name,
          IP: [..._self.IP, ..._self.dataConfig.acls].filter(item => item)
        })
        .then(res => {
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
          this.update();
          this.$Message.success("添加成功!");
          this.cancelModel();
          this.getManger();
        } else {
          this.$Message.error("添加失败!");
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
      this.configModal = false;
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
