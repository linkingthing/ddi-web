<template>
  <modal
    v-model="deviceModal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">新建视图</div>
    <div>
      <vue-scroll style="height: 500px;" ref="vs">
        <i-form
          :model="dataConfig"
          label-position="right"
          :label-width="100"
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
                  </i-col>
                </Row>
              </div>
            </div>

            <div class="pop-box" style="margin-top:-50px;">
              <div class="pop-body">
                <div style="width: 300px">
                  <FormItem
                    v-for="(item, index) in dataConfig.exception"
                    :key="index"
                    :label="'控制列表' + item.index"
                    :prop="'exception.' +  index +'.id'"
                    :rules="{required: true, message: '控制列表 ' + item.index +'不能为空'}"
                  >
                    <Row>
                      <Col span="18">
                        <i-select v-model="item.id">
                          <i-option
                            v-for="item in list"
                            :key="item.id"
                            :value="item.id"
                          >{{item.name}}</i-option>
                        </i-select>
                      </Col>
                      <Col span="4" offset="1">
                        <Button @click="handleRemove(index)" style="font-size: 20px;marin-left: 20px;">
                          <Icon type="md-trash" />
                        </Button>
                      </Col>
                    </Row>
                  </FormItem>
                </div>

                <Row style="margin-top:-10px;">
                  <i-col span="24">
                    <a href="javascript:" class="add-config" @click="handleAdd">+添加控制列表</a>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="24">
                    <form-item label="优先级" prop="priority">
                      <Input-number :max="10" :min="1" v-model="dataConfig.priority"></Input-number>
                    </form-item>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="24">
                    <FormItem label="是否启用" prop="isused">
                      <RadioGroup v-model="dataConfig.isused">
                        <Radio :label="1" :value="1">是</Radio>
                        <Radio :label="0" :value="0">否</Radio>
                      </RadioGroup>
                    </FormItem>
                  </i-col>
                </Row>
              </div>
            </div>
          </div>
        </i-form>
      </vue-scroll>
    </div>
    <div slot="footer">
      <i-button class="me-button k-btn" @click="deviceModal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import services from "@/services";
export default {
  name: "createView",
  data() {
    return {
      value: "",
      index: 1,
      deviceModal: false,
      list: [],
      arr: [],
      // 表单数据
      dataConfig: {
        title: "",
        name: "",
        priority: 1,
        isused: 1,
        model10: [],
        // 例外规则
        exception: [
          {
            id: "",
            index: 1,
            status: 1
          }
        ]
      },
      loading: false,
      // 表单验证规则
      ruleValidate: {
        name: [{ required: true, message: "请填访问控制名称" }],
        priority: [],
        isused: []
      }
    };
  },
  mounted() {
    this.accessList();
  },
  methods: {
    openConfig(data) {
      this.deviceModal = true;
      this.dataConfig.exception = [
        {
          id: "",
          index: 1,
          status: 1
        }
      ];
    },

    accessList() {
      services
        .getAccessList()
        .then(res => {
          this.list = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //新建
    update() {
      services
        .createView({
          name: this.dataConfig.name,
          aclids: this.dataConfig.exception
            .map(item => item.id)
            .filter(item => item),
          priority: this.dataConfig.priority,
          isused: this.dataConfig.isused
        })
        .then(res => {
          this.$emit("onCreateSuccess");
          this.$Message.success("添加成功!");
          this.cancelModel();
        })
        .catch(err => {
          console.log(err);
          this.$Message.error("添加失败!");
        });
    },
    // 确定
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.update();
        } else {
        }
      });
    },
    //    添加IP地址
    handleAdd() {
      this.index++;
      this.dataConfig.exception.push({
        id: "",
        index: this.index,
        status: 1
      });
    },
    handleRemove(index) {
      this.dataConfig.exception.splice(index, 1);
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
