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
                      <i-input v-model="dataConfig.name" placeholder="请填访问控制名称" :disabled="true"></i-input>
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
                    :prop="'exception.' + index + '.id'"
                    :rules="{required: true, message: '控制列表 ' + item.index +'不能为空'}"
                  >
                    <Row>
                      <!-- IP列表 -->
                      <Col span="18">
                        <i-select v-model="item.id" v-show="true">
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
                </div>

                <Row style="margin-top:-10px;">
                  <i-col span="24">
                    <a href="javascript:" class="add-config" @click="handleAdd">+添加控制列表</a>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="24">
                    <form-item label="优先级" prop="name">
                      <Input-number
                        :disabled="dataConfig.name === 'default'"
                        :max="maxPriority+1"
                        :min="1"
                        v-model="dataConfig.priority"
                      ></Input-number>
                    </form-item>
                  </i-col>
                </Row>
                <Row>
                  <i-col span="24">
                    <FormItem label="是否启用" prop="name">
                      <RadioGroup v-model="dataConfig.isused">
                        <Radio :label="1" isused="1">是</Radio>
                        <Radio :label="0" isused="0">否</Radio>
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
import services from "@/services";

export default {
  name: "ConfigGroupMgConfig",
  props: ["maxPriority"],
  data() {
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
        name: [{ required: true, message: "请填访问控制名称" }]
      }
    };
  },
  mounted() {
    this.accessList();
  },
  methods: {
    openConfig(id, current) {
      this.id1 = id;
      this.dataConfig = { ...current };
      this.dataConfig.exception = Array.isArray(current.acls)
        ? current.acls.map((item, index) => ({
            index,
            ...item
          }))
        : [];
      this.index = Array.isArray(current.acls) ? current.acls.length || 1 : 1;
      this.analysis2Modal = true;
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
      services
        .updateView(this.id1, {
          name: this.dataConfig.name,
          aclids: this.dataConfig.exception
            .map(item => item.id)
            .filter(item => item),
          priority: this.dataConfig.priority,
          isused: this.dataConfig.isused
        })
        .then(res => {
          this.$Message.success("修改成功!");
          this.cancelModel();
          this.$emit("onEditSuccess");
        })
        .catch(err => {
          this.$Message.error("修改失败!");
        });
    },
    // 确定
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.getModify();
        }
      });
    },
    // 添加IP地址
    handleAdd() {
      this.index++;
      this.dataConfig.exception.push({
        id: "",
        index: this.index,
        status: 1
      });
      this.$forceUpdate();
    },
    handleRemove(index) {
      this.dataConfig.exception.splice(index, 1);
      this.$forceUpdate();
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
