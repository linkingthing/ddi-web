<template>
  <common-modal :visible.sync="deviceModal" title="新建视图" @confirm="handleSubmit">
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

        <div class="pop-box">
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
                    <i-select v-model="item.id" style="width: 230px">
                      <i-option v-for="item in list" :key="item.id" :value="item.id">{{item.name}}</i-option>
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
                  <Input-number :max="maxPriority" :min="1" v-model="dataConfig.priority"></Input-number>
                </form-item>
              </i-col>
            </Row>
          </div>
        </div>
      </div>
    </i-form>
  </common-modal>
</template>

<script>
import services from "@/services";
import { nameValidate } from "@/util/common";

export default {
  name: "createView",
  props: ["maxPriority"],
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
        name: [
          { required: true, message: "请填访问控制名称" },
          {
            type: "string",
            max: 253,
            message: "最多只能253个字符"
          },
        ],
        priority: []
      }
    };
  },
  mounted() {
    this.accessList();
  },
  methods: {
    openConfig() {
      this.deviceModal = true;
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
        .then(() => {
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
    },
    handleRemove(index) {
      this.dataConfig.exception.splice(index, 1);
    },
    // 关闭弹窗
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
