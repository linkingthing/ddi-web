<template>
  <div class="global-config">
    <Form :model="params">
      <FormItem label="DNS日志">
        <i-switch
          @on-change="handleToggle"
          :value="params.IsOpen"
          size="large"
        >
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      params: {
        IsOpen: false
      }
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
      this.$getData({}, "/dns/dns/logs/log").then(res => {
        this.params = res
      })
    },
    handleToggle(IsOpen) {
      const params = { IsOpen }
      this.$put({ url: `/apis/linkingthing.com/dns/v1/logs/log`, params }).then(() => {
        this.getInitData();
        this.$Message.success("切换成功");
      }).catch(err => {
        this.$Message.error(err.response.data.message);
        this.getInitData();
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