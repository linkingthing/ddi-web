<template>
  <common-modal
    :visible.sync="dialogVisible"
    title="子网地址编辑"
    @confirm="handleConfirm"
    width="413"
  >
    <IviewLoading v-if="loading" />
    <Form
      :label-width="80"
      label-position="left"
      :label-colon="true"
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
import { resStringToArray } from "@/util/parser";
import ClientClassFormItem from "@/views/dhcp-service/address-pool/subnet-list/edit/ClientClassFormItem";

const ipv4FormList = [
  {
    label: "DNS",
    model: "domainServers",
    type: "input",
    placeholder: "请填写DNS，逗号隔开"
  },
  {
    label: "默认网关",
    model: "routers",
    type: "input"
  },
  {
    label: "option60",
    model: "clientClass",
    type: "component",
    component: ClientClassFormItem
  },
  {
    label: "option82",
    model: "relayAgentAddresses",
    type: "input"
  }
];

const ipv6FormList = [
  {
    label: "DNS",
    model: "domainServers",
    type: "input",
    placeholder: "请填写DNS，逗号隔开"
  }
];

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    subnet: {
      type: String,
      default: ""
    },

    tags: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      loading: false,
      dialogVisible: false,
      formModel: {},
      formItemList: []
    };
  },
  
  watch: {
    visible(val) {
      if (!val) return;
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.formModel = {};

      this.$emit("update:visible", val);
    },

    subnet(val) {
      if (ipv6IsValid(val)) {
        this.formItemList = ipv6FormList;
      }

      if (ipv4IsValid(val)) {
        this.formItemList = ipv4FormList;
      }
    }
  },

  methods: {
    handleConfirm() {
      this.loading = true;

      const params = { 
        ...this.formModel, 
        tags: this.tags, 
        subnet: this.subnet 
      };

      resStringToArray(params, ["domainServers", "routers", "relayAgentAddresses"]);

      this.$post({ url: "/address/dhcp/subnets", params }).then(({ id }) => {
        this.$$success("保存成功！");
        this.$emit("confirmed");
        
        this.$router.push({ path: `/address/dhcp/subnets/${id}/pools` });

        this.dialogVisible = false;
      }).catch(err => {
        this.$$error(err.response.data.message);
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>