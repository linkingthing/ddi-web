<template>
  <modal
    v-model="eviceModal"
    class-name=" vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false"
  >
    <div slot="header">修改访问控制表</div>
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
      <i-button class="me-button k-btn" @click="eviceModal = false">取消</i-button>
      <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div>
  </modal>
</template>

<script>
import axios from "axios";
import services from "@/services";
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
        name: [{ required: true, message: "请填访问控制名称" }]
      }
    };
  },
  mounted() {},
  methods: {
    getInitAccessById(id) {
      services.getAccessById(id).then(res => {
        const { IP, name } = res.data;
        this.params.name = name;
        this.params.list = IP.map(item => {
          if (String(item).startsWith("!")) {
            return {
              name: item,
              check: true
            };
          } else {
            return {
              name: item,
              check: false
            };
          }
        });
      });
    },
    openConfig(data) {
      this.eviceModal = true;
      this.accessId = data.data;
      this.getInitAccessById(data.data);
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
          IP: ips.filter(item => item)
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
    //关闭弹窗
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
