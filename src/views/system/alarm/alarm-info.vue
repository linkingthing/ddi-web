<template>
  <div class="alarm-info">
    <div class="">
      <Tabs value="tabValue">
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

    <div class="alarm-config">
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
          prop="passwd"
        >
          <Input
            type="password"
            v-model="alarmConfig.passwd"
            placeholder="请填写发件邮箱"
          />
        </FormItem>
        <FormItem
          label="发件箱密码"
          prop="passwdCheck"
        >
          <Input
            type="password"
            v-model="alarmConfig.passwdCheck"
            placeholder="请填写发件箱密码"
          />
        </FormItem>
        <FormItem
          label="邮箱服务器"
          prop="passwdCheck"
        >
          <Input
            type="password"
            v-model="alarmConfig.passwdCheck"
            placeholder="请填写邮箱服务器"
          />
        </FormItem>
        <FormItem
          label="邮箱服务器端口"
          prop="passwdCheck"
        >
          <Input
            type="password"
            v-model="alarmConfig.passwdCheck"
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

    <AdminEmail />

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
    return {
      tabValue: "alarmConfig",
      alarmConfig: {}
    };
  },
  computed: {},
  watch: {
    tabValue(value) {
      console.log(value)
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!');
        } else {
          this.$Message.error('Fail!');
        }
      })
    },
  }
};
</script>

<style lang="less" scoped>
.alarm-info {
  padding-top: 100px;
}
</style>