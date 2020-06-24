<template>
  <div class="alarm-info">
    <div class="top-border">
      <Tabs
        v-model="tabValue"
        class="top-tab"
      >
        <TabPane
          label="告警配置"
          name="alarmConfig"
        />
        <TabPane
          label="管理员列表"
          name="adminList"
        />
      </Tabs>
    </div>

    <div
      class="alarm-config"
      v-if="tabValue === 'alarmConfig'"
    >
      <Form
        ref="alarmConfig"
        :model="alarmConfig"
        :rules="rules"
        :label-width="120"
        label-position="left"
        style="width: 380px"
      >
        <FormItem
          label="发件邮箱"
          prop="username"
        >
          <Input
            v-model="alarmConfig.username"
            placeholder="请填写发件邮箱"
          />
        </FormItem>
        <FormItem
          label="发件箱密码"
          prop="password"
        >
          <Input
            type="password"
            v-model="alarmConfig.password"
            placeholder="请填写发件箱密码"
          />
        </FormItem>
        <FormItem
          label="邮箱服务器"
          prop="host"
        >
          <Input
            v-model="alarmConfig.host"
            placeholder="请填写邮箱服务器"
          />
        </FormItem>
        <FormItem
          label="邮箱服务器端口"
          prop="port"
        >
          <Input
            v-model.number="alarmConfig.port"
            placeholder="请填写邮箱服务器端口"
          />
        </FormItem>
        <FormItem :label-width="0">
          <Button
            style="width: 100%"
            type="primary"
            @click="handleSubmit('alarmConfig')"
          >确认</Button>

        </FormItem>
      </Form>
    </div>

    <AdminEmail v-else />

  </div>
</template>

<script>
import AdminEmail from "./modules/AdminEmail";
export default {
  components: {
    AdminEmail
  },
  props: {},
  data() {
    this.rules = {

    };
    return {
      tabValue: "alarmConfig",
      alarmConfig: {},
      configUpdateLink: "",
      links: {},
      method: "$put"
    };
  },
  computed: {},
  created() {
    this.getSender();
  },
  mounted() { },
  methods: {

    getSender() {
      this.$get(this.$getApiByRoute("/system/alarm/mailsenders")).then(({ data, links }) => {
        this.alarmConfig = (Array.isArray(data) && data.length) ? data[0] : {};
        this.links = links;
        this.configUpdateLink = this.alarmConfig.links.update;
      }).catch(() => {
        this.configUpdateLink = this.links.self;
        this.method = "$post";
        // this.$Message.error("获取发件者信息失败");
      })
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = this.alarmConfig;
          this[this.method]({ url: this.configUpdateLink, params }).then(() => {
            this.$Message.success("更新成功!");
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        } else {
          this.$Message.error("Fail!");
        }
      })
    },
  }
};
</script>

<style lang="less">
.alarm-info {
  padding-top: 60px;
  .top-border {
    border-top: 1px solid #f0f0f0;
    padding-top: 40px;
    padding-left: 25px;
    padding-bottom: 30px;
    .top-tab {
      position: relative;
      z-index: 100;
      display: inline-block;
    }
  }
  .ivu-tabs-bar {
    border: none;
    .ivu-tabs-tab {
      border-width: 3px;
      padding-left: 0;
      padding-right: 0;
      margin-right: 70px;
    }
    .ivu-tabs-ink-bar {
      display: none;
    }
    .ivu-tabs-tab-focused {
      &::after {
        content: "";
        display: block;
        height: 2px;
        width: 100%;
        box-sizing: border-box;
        background-color: #2d8cf0;
        position: absolute;
        left: 0;
        bottom: 1px;
        z-index: 1;
        transition: transform 0.3s ease-in-out;
        transform-origin: 0 0;
      }
    }
  }
  .alarm-config {
    padding: 0 25px;
    .ivu-form-item {
      margin-bottom: 36px;
    }
  }
}
</style>