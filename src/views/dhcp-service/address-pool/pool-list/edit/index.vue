<template>
  <common-modal
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm"
    :loading="loading"
  >
    <Form
      ref="form"
      label-position="left"
      :label-width="90"
      :label-colon="true"
      :rules="rules"
      :model="formData"
    >

      <FormItem
        style="margin-bottom: 36px;"
        label="地址池参数"
        prop="template"
      >
        <Select
          filterable
          v-model="formData.template"
        >
          <Option value="custom">
            自定义
          </Option>
          <Option
            v-for="item in poolTemplateList"
            :key="item.id"
            :value="item.id"
          >
            {{item.name}}
          </Option>

        </Select>
      </FormItem>

      <FormItem
        label="起始地址"
        prop="beginAddress"
      >
        <Input v-model="formData.beginAddress" />
      </FormItem>

      <FormItem
        label="结束地址"
        prop="endAddress"
      >
        <Input v-model="formData.endAddress" />
      </FormItem>

      <FormItem
        v-if="version === 4"
        label="默认网关"
        prop="routers"
      >
        <DomainServers v-model="formData.routers" />
      </FormItem>

      <FormItem
        label="DNS"
        prop="domainServers"
      >
        <DomainServers v-model="formData.domainServers" />
      </FormItem>
      <FormItem
        v-if="version === 4"
        label="0ption60"
        prop=""
      >
        <ClientClassFormItem v-model="formData.clientClass" />
      </FormItem>

    </Form>
  </common-modal>
</template>

<script>
import ClientClassFormItem from "../../subnet-list/edit/ClientClassFormItem";
import DomainServers from "@/components/DomainServers";
import {
  ipv6IsValid,
  isIPv4Reg,
  getAddressType,
  isPosNumber
} from "@/util/common";

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
      type: Number,
      default: null
    }
  },

  data() {
    this.rules = {
      template: [{
        validator: (rule, value, callback) => {
          if (value === "") {
            callback();
          } else if (value !== "custom") {
            this.validTemplate(value).then(() => {
              callback()
            }).catch((err) => {
              callback("模板错误：" + err.response.data.message)
            })
          } else {
            callback()
          }
        }
      }],
      beginAddress: [{
        required: true,
        message: "请输入起始地址",
      }],
      endAddress: [{
        required: true,
        message: "请输入结束地址",
      }]
    };
    return {
      formData: {
        template: "custom",
        beginAddress: "",
        endAddress: "",
        routers: [],
        domainServers: [],
        clientClass: ""
      },
      loading: false,
      dialogVisible: false,
      poolTemplateList: []
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "地址池";
    },
    isEdit() {
      return !!this.links.update;
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(res => {
          this.formData = res;
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      if (!val) {
        this.$refs.form.resetFields();
      }

      this.$emit("update:visible", val);
    },

    version: {
      immediate: true,
      handler(value) {
        if (value) {
          this.getPoolTemplateList()
        }
      }
    },

    "formData.template"(value) {
      if (value === "") { return false }
      else if (value === "custom") {
        this.formData.beginAddress = "";
        this.formData.endAddress = "";
        this.formData.routers = [];
        this.formData.domainServers = [];
        this.formData.clientClass = "";
      } else {
        const target = this.poolTemplateList.find(item => item.id === value);
        if (target) {
          const { routers, domainServers, clientClass } = target
          this.formData.routers = routers;
          this.formData.domainServers = domainServers;
          this.formData.clientClass = clientClass;
        }
      }
    }
  },

  created() {
    // console.log(this.links.update) // ranck？为什么呢会直接运行了 

  },

  methods: {

    validTemplate(template) {
      const url = this.links.self;
      const params = {
        template,
      };
      return this.$post({ url: `${url}?action=valid_template`, params }).then(res => {
        const { beginAddress, endAddress } = res;
        this.formData.beginAddress = beginAddress;
        this.formData.endAddress = endAddress;
        return res;
      })
    },
    getPoolTemplateList() {
      const params = {
        version: this.version
      }
      this.$get({ url: "/apis/linkingthing.com/dhcp/v1/pooltemplates", params }).then(({ data }) => {
        this.poolTemplateList = data;
      })
    },

    handleConfirm() {
      this.$refs.form.validate(isvalid => {
        if (isvalid) {
          this.loading = true;
          const params = { ...this.formData };
          if (params.template === "custom") {
            delete params.template
          }

          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(res => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
              this.loading = false;
            }).catch(err => {
              this.loading = false;
              this.$$error(err.response.data.message);
            });
          } else {
            this.$post({ url: this.links.self, params }).then(res => {
              this.$$success("新建成功");
              this.$emit("success");
              this.dialogVisible = false;
              this.loading = false;
            }).catch(err => {
              this.loading = false;
              this.$$error(err.response.data.message);
            });
          }
        }
      })


    }

  }
};
</script>

<style lang="less">
@import "./index.less";
</style>