<template>
  <common-modal
    :visible.sync="eviceModal"
    title="修改访问控制表"
    @confirm="handleSubmit"
  >
    <i-form
      :model="params"
      label-position="right"
      :label-width="80"
      :rules="ruleValidate"
      ref="formValidate"
    >
      <div class="pop-content">
        <Row>
          <i-col span="20">
            <form-item
              label="名称"
              prop="name"
            >
              <i-input
                v-model="params.name"
                placeholder="请填访问控制名称"
              />
            </form-item>
            <form-item
              label="IP列表"
              prop="IP"
            >
              <div
                v-for="item in params.list"
                :key="item.name"
              >
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
              <Select
                filterable
                style="width: 150px"
                @on-change="handleSelectAcl"
              >
                <Option
                  v-for="item in accessList"
                  :key="item.id"
                  :value="item.id"
                >{{item.name}}</Option>
              </Select>
              <Button
                type="primary"
                @click="handleAddAcl"
              >添加</Button>
            </form-item>
            <form-item label="IP">
              <Checkbox v-model="ipcheck">禁止</Checkbox>
              <Input
                v-model="ip"
                placeholder="输入ip后点击添加"
                style="width: 150px"
              />
              <Button
                type="primary"
                @click="handleAddIP"
              >添加</Button>
            </form-item>
          </i-col>
        </Row>
      </div>
    </i-form>
  </common-modal>
</template>

<script>
import services from "@/services";
import { commonNameValidate } from "@/util/common";

export default {
  name: "EviceStatisticsConfig",
  props: ["accessList", "id"],
  data() {
    return {
      value: "",
      IP: [],
      accessId: "",
      eviceModal: false,
      params: {
        name: "",
        list: []
      },
      ip: "",
      acl: "",
      aclcheck: false,
      ipcheck: false,
      ruleValidate: {
        name: [
          { required: true, message: "请填访问控制名称" },
          commonNameValidate
        ]
      }
    };
  },
  mounted() { },
  methods: {
    getInitAccessById(id) {
      services.getAccessById(id).then(res => {
        const { list, name } = res.data;
        this.params.name = name;
        this.params.list = list;
      });
    },
    handleSelectAcl(id) {
      this.acl = this.accessList.find(item => item.id === id)
    },
    openConfig(data) {
      this.eviceModal = true;
      this.accessId = data.data;
      this.getInitAccessById(data.data);
    },
    handleAddAcl() {
      if (/^\s+$/.test(this.acl) || this.acl === "") {
        return;
      }
      const acl = this.aclcheck ? `!${this.acl}` : this.acl;
      if (!this.params.list.map(item => item.name).includes(acl)) {
        this.params.list.push({
          check: this.aclcheck,
          name: acl.name,
          aclid: acl.id,
          type: "acl"
        });
      } else {
        this.$Message.info("请勿重复添加");
      }
    },
    handleAddIP() {
      if (/^\s+$/.test(this.ip) || this.ip === "") {
        return;
      }
      const ip = this.ipcheck ? `!${this.ip}` : this.ip;
      if (!this.params.list.map(item => item.name).includes(ip)) {
        this.params.list.push({
          check: this.ipcheck,
          name: ip,
          // aclid: "1",
          type: "ip"
        });
      } else {
        this.$Message.info("请勿重复添加");
      }
    },
    handleDeleteTag(name) {
      const index = this.params.list.map(item => item.name).indexOf(name);
      this.params.list.splice(index, 1);
    },
    // 确定
    handleSubmit() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.getModify();
          this.$Message.success("修改成功!");
          this.cancelModel();
        } else {
          this.$Message.error("修改失败!");
        }
      });
    },
    //  修改
    getModify() {
      const ips = this.params.list.map(item => item.name);
      services
        .updateAccess(this.accessId, {
          name: this.params.name,
          list: this.params.list
        })
        .then(res => {
          this.$emit("onSuccess");
        })
        .catch(err => {
          console.log(err);
        });
    },
    //  添加IP地址
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
    // 关闭弹窗
    cancelModel() {
      this.eviceModal = false;
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
