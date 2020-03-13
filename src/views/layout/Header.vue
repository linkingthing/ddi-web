<template>
  <div class="Head">
    <div class="header">
      <div class="header-inner">
        <div class="user">
          <Badge :count="3">
            <Icon type="ios-notifications-outline" style="font-size: 20px" />
          </Badge>
          <Dropdown style="margin-left: 20px" @on-click="handleClickMenu">
            <a href="javascript:void(0)">
              <img src="../../assets/images/avatar.png" alt class="avatar" />
              Admin
              <Icon type="md-arrow-dropdown" />
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="user" key="user">用户信息</DropdownItem>
              <DropdownItem name="password" key="password">修改密码</DropdownItem>
              <DropdownItem name="out" key="out">退出系统</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <Modal v-model="visible" title="修改密码">
      <Form :label-width="80" style="width: 400px;margin:0 auto">
        <FormItem label="账号">admin</FormItem>
        <FormItem label="密码">
          <Input v-model="password" type="password" placeholder="请输入密码" />
        </FormItem>
        <FormItem label="再次输入">
          <Input v-model="rePassword" type="password" placeholder="请在此输入密码" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" @click="handleSubmit">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      visible: false,
      password: "",
      rePassword: ""
    };
  },
  methods: {
    ...mapMutations({
      setToken: "SET_TOKEN"
    }),

    handleClickMenu(name) {
      const self = this;
      if (name === "out") {
        self.setToken("");
        self.$router.push({
          path: "/login"
        });
      }
      if (name === "password") {
        this.visible = true;
      }
    },
    handleSubmit() {
      if (this.password === this.rePassword) {
        services
          .updatePassword({
            username: "admin",
            password: this.password
          })
          .then(res => {
            this.$Message.success("修改成功");
            this.visible = false;
          });
      } else {
        this.visible = true;
        this.$Message.error("两次密码输入不一致");
      }
    },
    cancel() {
      this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  padding-left: 240px;
  display: flow-root;
  height: 100px;
  box-sizing: border-box;

  .header-inner {
    position: relative;
    background: #f4f3ef;
    width: 100%;
    height: 100px;

    padding: 25px 30px;
    box-sizing: border-box;
    z-index: 10;
    border-bottom: 1px solid #ddd;
  }

  .user {
    font-size: 16px;
    float: right;
    .avatar {
      height: 36px;
      height: 36px;
      padding-right: 20px;
      vertical-align: middle;
    }
  }
}
</style>