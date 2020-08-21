<template>
  <div class="white-list">
    <div class="white-list_inner">
      <Form
        style="width: 500px"
        :model="formData"
        :label-width="80"
        :label-colon="true"
        label-position="left"
        ref="formValidate"
        :rules="rules"
      >
        <FormItem label="启用">
          <i-switch
            v-model="formData.isEnable"
            size="large"
          >
            <span slot="open">启用</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem
          label="ip地址"
          prop="ips"
        >

          <NetworkList v-model="formData.ips" />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="handleSubmit('formValidate')"
          >保存</Button>
        </FormItem>

      </Form>
    </div>
  </div>
</template>

<script>

import NetworkList from "@/components/NetworkList";
export default {
  components: { NetworkList },
  props: {},
  data() {
    const self = this;
    this.rules = {
      ips: [{
        trigger: "blur",
        validator(rule, value, callback) {
          if (self.formData.isEnable) {
            if (value.length > 0) {
              callback();
            }
            callback("请填写ips");
          } else {
            callback();
          }
        }
      }]
    };
    return {
      formData: {
        isEnable: false,
        ips: []
      },
      links: {}
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getData();
  },
  mounted() { },
  methods: {
    getData() {
      this.$getData().then(({ data }) => {
        if (Array.isArray(data) && data.length) {
          const { ips, isEnable, links } = data[0]
          this.formData.ips = ips || [];
          this.formData.isEnable = isEnable;

          this.links = links;
        }
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = this.formData;
          this.$put({ url: this.links.update, params }).then(() => {
            this.$Message.success("更新成功！");
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          })
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.white-list {
  padding-top: 60px;

  .white-list_inner {
    border-top: 1px solid #ddd;
    padding: 25px;
  }
}
</style>