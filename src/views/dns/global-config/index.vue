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
          :disabled="!$hasPermissionCreate('dnsglobalconfig')"
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
          :disabled="!$hasPermissionCreate('dnsglobalconfig')"
          @on-change="handleSECToggle"
          :value="params.dnssecEnable"
          :loading="secLoading"
          size="large"
        >
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>

      <FormItem label="主区服务端口">
        <Input
          v-model.number="params.transferPort"
          style="width: 120px"
          :disabled="!$hasPermissionCreate('dnsglobalconfig')"
        />
        <Button
          :disabled="!$hasPermissionCreate('dnsglobalconfig')"
          type="primary"
          @click="handleSave('transferPort')"
        >保存</Button>
      </FormItem>

      <FormItem
        label="递归并发"
        prop="recursiveClients"
      >
        <Input
          v-model="params.recursiveClients"
          style="width: 120px"
          :disabled="!$hasPermissionCreate('dnsglobalconfig')"
        />
        <Button
          type="primary"
          @click="handleSave('recursive')"
          :disabled="!$hasPermissionCreate('dnsglobalconfig')"
        >保存</Button>
      </FormItem>

      <FormItem
        label="TTL"
        prop="ttl"
      >
        <Input
          v-model="params.ttl"
          style="width: 120px"
          :disabled="!$hasPermissionCreate('dnsglobalconfig')"
        />
        <Button
          v-if="$hasPermissionCreate('dnsglobalconfig')"
          :loading="ttlLoading"
          type="primary"
          @click="handleSave('ttl')"
        >保存</Button>
      </FormItem>

      <FormItem label="启用IP黑名单">
        <i-switch
          @on-change="handleBlackholeEnableToggle"
          :value="params.blackholeEnable"
          :loading="secLoading"
          size="large"
          :disabled="!$hasPermissionCreate('dnsglobalconfig')"
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
          :disabled="!$hasPermissionCreate('dnsglobalconfig')"
          placeholder="例如:
10.0.0.1
192.160.0.0/24
2419::12
2419::/64
以换行符分割"
          v-model="params.blackholes"
          :autosize="{minRows: 5,maxRows: 5}"
          style="width: 324px"
        />
        <Button
          :disabled="!$hasPermissionCreate('dnsglobalconfig')"
          style="vertical-align: top;"
          type="primary"
          @click="handleSave('blackhole')"
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


const updateModalEnum = {
  log: "log",
  ttl: "ttl",
  dnssec: "dnssec",
  blackhole: "blackhole",
  recursion: "recursion",
  recursive: "recursive",
  transferPort: "transferPort"
}

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
        recursiveClients: 0,
        transferPort: 53
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
          res.blackholes = Array.isArray(res.blackholes) ? res.blackholes.join("\n") : "";
        }
        this.params = res;
        this.links = res.links;
      });
    },


    handleToggle(logEnable) {
      this.logLoading = true;
      const params = { ...this.params, logEnable, updateModel: updateModalEnum.log };
      if (!Array.isArray(params.blackholes)) {
        if (typeof params.blackholes === "string") {
          params.blackholes = params.blackholes.split("\n").filter(item => !!item);
        }
      }
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
      const params = { ...this.params, dnssecEnable, updateModel: updateModalEnum.dnssec };
      if (!Array.isArray(params.blackholes)) {
        if (typeof params.blackholes === "string") {
          params.blackholes = params.blackholes.split("\n").filter(item => !!item);
        }
      }
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
      const params = { ...this.params, recursionEnable, updateModel: updateModalEnum.recursion };
      if (!Array.isArray(params.blackholes)) {
        if (typeof params.blackholes === "string") {
          params.blackholes = params.blackholes.split("\n").filter(item => !!item);
        }
      }
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
      const params = { ...this.params, blackholeEnable, updateModel: updateModalEnum.blackhole };
      if (!Array.isArray(params.blackholes)) {
        if (typeof params.blackholes === "string") {
          params.blackholes = params.blackholes.split("\n").filter(item => !!item);
        }
      }
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
    handleSave(option) {
      this.$refs.formInline.validate(valid => {
        if (valid) {
          // this.ttlLoading = true;
          const params = { ...this.params };
          params.ttl = Number(params.ttl);
          params.recursiveClients = Number(params.recursiveClients);
          params.updateModel = updateModalEnum[option];

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
  padding: 80px 20px;
  .ivu-switch-inner span {
    font-size: 12px;
  }
}
</style>