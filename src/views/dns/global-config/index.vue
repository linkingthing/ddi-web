<template>
  <div class="global-config">
    <Form
      :model="params"
      :label-width="100"
      label-position="left"
      ref="formInline"
      :rules="rules"
      style="width: 500px"
    >
      <FormItem label="DNS日志">
        <i-switch
          @on-change="handleToggle"
          :value="params.logEnable"
          :loading="logLoading"
          size="large"
        >
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="DNSSEC">
        <i-switch
          @on-change="handleSECToggle"
          :value="params.dnssecEnable"
          :loading="secLoading"
          size="large"
        >
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>

      <FormItem label="递归">
        <i-switch
          @on-change="handleRecursionEnableToggle"
          :value="params.recursionEnable"
          :loading="secLoading"
          size="large"
        >
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>

      <FormItem
        label="递归并发"
        prop="recursiveClients"
      >
        <Input
          v-model="params.recursiveClients"
          style="width: 120px"
        />
        <Button
          type="primary"
          @click="handleSave"
        >保存</Button>
      </FormItem>

      <FormItem
        label="TTL"
        prop="ttl"
      >
        <Input
          v-model="params.ttl"
          style="width: 120px"
        />
        <Button
          :loading="ttlLoading"
          type="primary"
          @click="handleSave"
        >保存</Button>
      </FormItem>

      <FormItem label="启用IP黑名单">
        <i-switch
          @on-change="handleBlackholeEnableToggle"
          :value="params.blackholeEnable"
          :loading="secLoading"
          size="large"
        >
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>

      <FormItem
        label="IP黑名单"
        prop="blackholes"
      >
        <Input
          type="textarea"
          v-model="params.blackholes"
          :autosize="{minRows: 5,maxRows: 5}"
          style="width: 324px"
        />
        <Button
          style="vertical-align: top;"
          type="primary"
          @click="handleSave"
        >保存</Button>
      </FormItem>

    </Form>
  </div>
</template>

<script>
import {
  positiveIntegerValidate
  
} from "@/util/common";
import { ttlValidator, ipListValidator } from "@/util/validator";

export default {
  components: {},
  props: {},
  data() {

    this.rules = {
      ttl: [
        positiveIntegerValidate,
        {
          validator: ttlValidator
        }
      ],
      blackholes: [
        {
          validator: ipListValidator
        }
      ]
    };
    return {
      params: {
        logEnable: false,
        ttl: 3600,
        recursionEnable: false,
        recursiveClients: 0
      },
      links: null,
      logLoading: false,
      secLoading: false,
      ttlLoading: false
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getInitData();
  },
  mounted() { },
  methods: {
    getInitData() {
      this.$getData({}, "/dns/dns/dnsglobalconfigs").then(({ data: [res] }) => {
        if (res.blackholes) {
          res.blackholes = res.blackholes.join("\n");
        }
        this.params = res;
        this.links = res.links;
      });
    },
    handleToggle(logEnable) {
      this.logLoading = true;
      const params = { ...this.params, logEnable };
      this.$put({ url: this.links.update, params }).then(() => {
        this.getInitData();
        this.$Message.success("切换成功");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
        this.getInitData();
      }).finally(() => {
        this.logLoading = false;
      });
    },
    handleSECToggle(dnssecEnable) {
      const params = { ...this.params, dnssecEnable };
      this.secLoading = true;
      this.$put({ url: this.links.update, params }).then(() => {
        this.getInitData();
        this.$Message.success("切换成功");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
        this.getInitData();
      }).finally(() => {
        this.secLoading = false;
      });
    },
    handleRecursionEnableToggle(recursionEnable) {
      const params = { ...this.params, recursionEnable };
      this.secLoading = true;
      this.$put({ url: this.links.update, params }).then(() => {
        this.getInitData();
        this.$Message.success("切换成功");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
        this.getInitData();
      }).finally(() => {
        this.secLoading = false;
      });
    },
    handleBlackholeEnableToggle(blackholeEnable) {
      const params = { ...this.params, blackholeEnable };
      this.secLoading = true;
      this.$put({ url: this.links.update, params }).then(() => {
        this.getInitData();
        this.$Message.success("切换成功");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
        this.getInitData();
      }).finally(() => {
        this.secLoading = false;
      });
    },
    handleSave() {
      this.$refs.formInline.validate(valid => {
        if (valid) {
          // this.ttlLoading = true;
          const params = { ...this.params };
          params.ttl = Number(params.ttl);
          params.recursiveClients = Number(params.recursiveClients);



          if (!Array.isArray(params.blackholes)) {
            if (typeof params.blackholes === "string") {
              params.blackholes = params.blackholes.split("\n").filter(item => !!item);
            }
          }

          this.$put({ url: this.links.update, params }).then(() => {
            this.getInitData();
            this.$Message.success("保存成功");
          }).catch(err => {
            this.$Message.error(err.response.data.message);
            this.getInitData();
          }).finally(() => {
            this.ttlLoading = false;
          });
        }
      })

    }

  }
};
</script>

<style lang="less" scoped>
.global-config {
  padding: 60px 20px;
  .ivu-switch-inner span {
    font-size: 12px;
  }
}
</style>