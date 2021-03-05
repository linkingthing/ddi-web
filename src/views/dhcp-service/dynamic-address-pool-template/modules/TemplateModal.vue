<template>
  <common-modal
    class="pool-template-modal"
    :visible.sync="dialogVisible"
    :title="title"
    :width="413"
    :loading="loading"
    @confirm="handleConfirm('form')"
  >
    <Form
      ref="form"
      :label-width="120"
      :model="formData"
      :label-colon="true"
      :rules="rules"
    >
      <FormItem
        label="模板名称"
        prop="name"
      >
        <span v-if="isEdit">{{formData.name}}</span>
        <Input
          v-else
          placeholder=""
          v-model="formData.name"
        />
      </FormItem>
      <FormItem
        label="地址起始位置"
        prop="beginOffset"
      >
        <Input
          placeholder=""
          v-model.number="formData.beginOffset"
        />
      </FormItem>
      <FormItem
        label="地址数量"
        prop="capacity"
      >
        <Input
          placeholder=""
          v-model.number="formData.capacity"
        />
      </FormItem>
      <FormItem
        label="DNS"
        prop="domainServers"
      >

        <DomainServers v-model="formData.domainServers" />
      </FormItem>

      <template v-if="formData.version === 4">

        <FormItem
          label="默认网关"
          prop="routers"
        >
          <DomainServers v-model="formData.routers" />
        </FormItem>
        <FormItem
          label="0ption60"
          prop="clientClass"
        >

          <ClientClassFormItem v-model="formData.clientClass" />
        </FormItem>

      </template>

      <FormItem
        label="备注"
        prop="comment"
      >
        <Input
          placeholder=""
          v-model="formData.comment"
        />
      </FormItem>
    </Form>
  </common-modal>
</template>

<script>

import ClientClassFormItem from "../../address-pool/subnet-list/edit/ClientClassFormItem";
import DomainServers from "@/components/DomainServers";

export default {
  components: {
    ClientClassFormItem,
    DomainServers
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    links: {
      type: Object,
      default: () => ({})
    },
    version: {
      type: String,
      default: "4"
    },
  },
  data() {
    this.rules = {
      name: [{
        required: true,
        message: "请输入模板名称"
      }],
      version: [{
        required: true,
        message: "请选择地址类型"
      }],
      beginOffset: [{
        required: true,
        message: "请输入地址起始位置"
      }],
      capacity: [{
        required: true,
        message: "请输入地址总量"
      }]
    };
    return {
      loading: false,
      dialogVisible: false,
      formData: {
        version: 4,
        name: "",
        beginOffset: "",
        capacity: "",
        domainServers: [],
        routers: [],
        clientClass: "",
        comment: ""
      }
    };
  },
  computed: {
    isEdit() {
      const isEdit = !!this.links.update;
      return isEdit;
    },
    title() {
      return (!this.isEdit ? "新建" : "编辑") + (this.version === "4" ? "IPv4" : "IPv6") + "动态地址池模板"
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.reset();
        return;
      }

      if (this.links.update) {
        this.loading = true;
        this.$get({ url: this.links.self }).then(res => {
          this.formData = res;
        }).catch().finally(() => {
          this.loading = false;
        });
      } else {
        this.formData.version = +this.version;
      }

      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },

  },
  created() { },
  mounted() { },
  methods: {
    reset() {
      this.$refs["form"].resetFields();
    },
    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = this.formData;
          if (this.isEdit) {
            this.$put({
              url: this.links.update,
              params
            }).then(() => {
              this.$Message.success('更新成功');
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$Message.error(err.response.data.message);
            });
          } else {
            this.$post({
              url: this.links.self,
              params
            }).then(() => {
              this.$Message.success('创建成功');
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$Message.error(err.response.data.message);
            });
          }

        }
      })

    }
  }
};
</script>

<style lang="less" scoped>
</style>