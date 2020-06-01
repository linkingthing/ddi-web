<template>
  <common-modal
    :visible.sync="dialogVisible"
    title="子网地址编辑"
    @confirm="handleConfirm"
    width="413"
  >
    <IviewLoading v-if="loading" />
    <Form
      :label-width="100"
      label-position="left"
      :label-colon="true"
      :model="formModel"
    >
      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
      />
    </Form>

  </common-modal>
</template>

<script>
import { ipv6IsValid, ipv4IsValid } from "@/util/common";
import { resArrayToString, resStringToArray } from "@/util/parser";
import ClientClassFormItem from "./ClientClassFormItem";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    links: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      loading: false,
      dialogVisible: false,
      formModel: {}

    };
  },

  computed: {
    formItemList() {
      const ipv4FormList = [
        {
          label: "子网地址",
          model: "ipnet",
          type: "input",
          placeholder: "请填写子网地址"
        },
        {
          label: "DNS",
          model: "domainServers",
          type: "input",
          placeholder: "请填写DNS，逗号隔开"
        },
        {
          label: "默认网关",
          model: "routers",
          type: "input",
          placeholder: "请填写默认网关"
        },
        {
          label: "option 60",
          model: "clientClass",
          type: "component",
          component: ClientClassFormItem
        },
        {
          label: "option 82",
          model: "relayAgentAddresses",
          type: "input",
          placeholder: "请填写默认网关"
        }
      ];

      const ipv6FormList = [{
        label: "DNS",
        model: "domainServers",
        type: "input",
        placeholder: "请填写DNS，逗号隔开"
      }
      ];

      if (this.formModel.version === 6) {
        return ipv6FormList;
      }

      if (this.formModel.version === 4) {
        return ipv4FormList;
      }

      return [];
    },

    isCreate() {
      const { create } = this.links;
      return !!create;
    }
  },
  watch: {
    visible(val) {
      if (!val) return;

      this.dialogVisible = val;
    },

    dialogVisible(val) {
      if (!val) {
        this.formModel = {};
      } else {
        console.log(11, this.links)
        if (this.isCreate) {
          const { ipnet } = this.$route.query;
          let version;
          if (ipv6IsValid(ipnet)) {
            version = 6;
          }
          if (ipv4IsValid(ipnet)) {
            version = 4;
          }
          this.formModel = {
            version,
            ipnet
          };
        } else {
          this.getData(this.links);
        }
      }
      this.$emit("update:visible", val);
    }
  },

  methods: {
    getData({ self }) {
      this.$get({ url: self }).then(res => {
        resArrayToString(res, ["domainServers", "routers", "relayAgentAddresses"]);
        this.formModel = res;
      });
    },

    handleConfirm() {

      this.loading = true;
      const params = { ...this.formModel };

      resStringToArray(params, ["domainServers", "routers", "relayAgentAddresses"]);
      if (this.isCreate) {
        this.$post({ url: this.links.create, params }).then(res => {
          this.$$success("保存成功！");
          this.$emit("success");
          this.dialogVisible = false;
        }).catch(err => {
          this.$$error(err.response.data.message);
        }).finally(() => {
          this.loading = false;
        });
      } else {
        this.$put({ url: this.links.update, params }).then(res => {
          this.$$success("保存成功！");
          this.$emit("success");
          this.dialogVisible = false;
        }).catch(err => {
          this.$$error(err.response.data.message);
        }).finally(() => {
          this.loading = false;
        });
      }

    }
  }
};
</script>