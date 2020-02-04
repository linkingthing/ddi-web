<template>
  <modal
    v-model="analysis2Modal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">修改视图</div>
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
                      <i-input
                        v-model="dataConfig.name"
                        placeholder="请填访问控制名称"
                        :disabled="true"
                        style="margin-left:10px;"
                      ></i-input>
                    </form-item>
                  </i-col>
                </Row>
              </div>
            </div>

            <div class="pop-box" style="margin-top:-50px;">
              <div class="pop-body">
                <Form ref="dataConfig" :model="dataConfig" :label-width="90" style="width: 300px">
                  <FormItem
                    v-for="(item, index) in dataConfig.exception"
                    :key="index"
                    :label="'控制列表' + item.index"
                    :prop="'exception.' + index + '.value'"
                    :rules="{required: true, message: '控制列表 ' + item.index +'不能为空', trigger: 'blur'}"
                  >
                    <Row>
                      <!-- IP列表 -->
                      <Col span="18">
                        <!-- @change="filtrate" -->
                        <i-select v-model="item.id" @on-change="filtrate" v-show="true">
                          <i-option
                            v-for="item in list"
                            :key="item.id"
                            :value="item.id"
                          >{{item.name}}</i-option>
                        </i-select>
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

                <Row style="margin-top:-10px;">
                  <i-col span="24">
                    <a href="javascript:" class="add-config" @click="handleAdd">+添加控制列表</a>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="24">
                    <form-item label="优先级" prop="name">
                      <Input-number
                        :max="10"
                        :min="1"
                        :value="dataConfig.priority"
                        style="margin-left:10px;"
                      ></Input-number>
                    </form-item>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="24">
                    <FormItem label="是否启用" prop="name" :label-width="90">
                      <RadioGroup v-model="dataConfig.isused" style="margin-left:10px;">
                        <Radio label="1" isused="1">是</Radio>
                        <Radio label="0" isused="0">否</Radio>
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
      <i-button class="me-button k-btn" @click="analysis2Modal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import { isURL, isNumber, isEmpty } from "../util/common";
import services from "@/services";

export default {
  name: "ConfigGroupMgConfig",
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
      value: "",
      aclids: [],
      index: 1,
      analysis2Modal: false,
      list: [],
      arr: [],
      id: "",
      name: "",
      id1: "",
      id2: "",
      disabled: false,
      // 表单数据
      dataConfig: {
        title: "",
        name: "",
        priority: 1,
        isused: "",
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
        name: [{ required: true, validator: validator1, trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.accessList();
  },
  methods: {
    openConfig(a, b) {
      this.id1 = a;
      this.dataConfig.name = b;
      this.analysis2Modal = true;
      // this.title = data.title
    },
    filtrate(data) {
      //   if(this.id2 == data){
      //     this.list.hidden(data,1);
      //   }
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
    getModify() {
      // let _self = this;
      for (var key in this.dataConfig.exception) {
        this.id = this.dataConfig.exception[key].id;
        this.aclids.push(this.id);
      }
      this.$axios
        .put(
          "http://10.0.0.19:8081/apis/linkingthing.com/example/v1/views/" +
            this.id1,
          {
            name: this.dataConfig.name,
            aclids: this.aclids,
            priority: this.dataConfig.priority,
            isused: this.dataConfig.isused
          }
        )
        .then(res => {
          console.log(res);
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
          this.$Message.success("修改成功!");
          this.cancelModel();
          this.getManger();
        } else {
          this.$Message.error("修改失败!");
        }
      });
    },
    //    添加IP地址
    handleAdd() {
      this.index++;
      // this.filtrate();
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
      this.analysis2Modal = false;
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
