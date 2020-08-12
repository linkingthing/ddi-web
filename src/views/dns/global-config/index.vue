<template>
  <div class="global-config">
    <Form
      :model="params"
      :label-width="80"
      label-position="left"
      ref="formInline"
      :rules="rules"
    >
      <FormItem label="DNS日志">
        <i-switch
          @on-change="handleToggle"
          :value="params.isLogOpen"
          size="large"
        >
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
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
import { ttlValidator } from "@/util/validator";

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
      ]
    }
    return {
      params: {
        isLogOpen: false,
        ttl: 3600
      },
      links: null
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
        this.params = res;
        this.links = res.links;
      })
    },
    handleToggle(isLogOpen) {
      const params = { ...this.params, isLogOpen }
      this.$put({ url: this.links.update, params }).then(() => {
        this.getInitData();
        this.$Message.success("切换成功");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
        this.getInitData();
      });
    },
    handleSave() {
      this.$refs.formInline.validate(valid => {
        if (valid) {
          const params = this.params;
          params.ttl = Number(params.ttl);
          this.$put({ url: this.links.update, params }).then(() => {
            this.getInitData();
            this.$Message.success("保存成功");
          }).catch(err => {
            this.$Message.error(err.response.data.message);
            this.getInitData();
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