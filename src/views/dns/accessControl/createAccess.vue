<template>
  <modal
    v-model="configModal"
    class-name=" vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">新建访问控制表</div>
    <div>
      <vue-scroll style="height: 500px;" ref="vs">
        <i-form
          :model="params"
          label-position="right"
          :label-width="80"
          :rules="ruleValidate"
          ref="formValidate"
        >
          <div class="pop-content">
            <Row>
              <i-col span="18">
                <form-item label="名称" prop="name">
                  <i-input v-model="params.name" placeholder="请填访问控制名称"></i-input>
                </form-item>
                <form-item label="IP列表" prop="IP">
                  <div v-for="item in params.list" :key="item.name">
                    <Tag
                      type="border"
                      closable
                      :color="item.check ? 'error' : 'primary'"
                      @on-close="handleDeleteTag(item.name)"
                    >{{item.name}}</Tag>
                  </div>
                </form-item>
                <form-item label="acl">
                  <Checkbox v-model="aclcheck">禁止</Checkbox>
                  <Select filterable style="width: 150px" v-model="acl">
                    <Option
                      v-for="item in accessList"
                      :key="item.id"
                      :value="item.name"
                    >{{item.name}}</Option>
                  </Select>
                  <Button type="primary" @click="handleAddAcl">添加</Button>
                </form-item>
                <form-item label="IP">
                  <Checkbox v-model="ipcheck">禁止</Checkbox>
                  <Input v-model="ip" placeholder="输入ip后点击添加" style="width: 150px" />
                  <Button type="primary" @click="handleAddIP">添加</Button>
                </form-item>
              </i-col>
            </Row>
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
      index: 1,
      configModal: false,
      params: {
        name: "",
        list: []
      },
      ip: "",
      acl: "",
      aclcheck: false,
      ipcheck: false,
      // 表单验证规则
      ruleValidate: {
        name: [{ required: true, message: "请填访问控制名称" }]
      }
    };
  },
  methods: {
    openConfig() {
      this.configModal = true;
      this.params.name = "";
      this.params.list = [];
    },
    handleAddAcl() {
      const acl = this.aclcheck ? `!${this.acl}` : this.acl;
      if (!this.params.list.map(item => item.name).includes(acl)) {
        this.params.list.push({
          check: this.aclcheck,
          name: acl
        });
      } else {
        this.$Message.info("请勿重复添加");
      }
    },
    handleAddIP() {
      const ip = this.ipcheck ? `!${this.ip}` : this.ip;
      if (!this.params.list.map(item => item.name).includes(ip)) {
        this.params.list.push({
          check: this.ipcheck,
          name: ip
        });
      } else {
        this.$Message.info("请勿重复添加");
      }
    },
    handleDeleteTag(name) {
      const index = this.params.list.map(item => item.name).indexOf(name);
      this.params.list.splice(index, 1);
    },
    update() {
      let _self = this;
      const ips = this.params.list.map(item => item.name);
      services
        .createAccess({
          name: this.params.name,
          IP: ips.filter(item => item)
        })
        .then(res => {
          this.cancelModel();
          this.$Message.success("添加成功!");
          this.$emit("onSuccess");
        })
        .catch(err => {
          this.$Message.error("添加失败!");
        });
    },
    // 确定
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (this.params.list.length === 0) {
            this.$Message.info("请选择acl或者添加ip");
            return;
          }
          this.update();
        }
      });
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
