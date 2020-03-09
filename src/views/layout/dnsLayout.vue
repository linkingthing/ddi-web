<template>
  <main class="main-content">
    <!-- 菜单 -->
    <menu-nav-dns></menu-nav-dns>
    <section class="content">
      <div class="header">
        <div class="header-inner">
          <div class="user">
            <Badge :count="3">
              <Icon type="ios-notifications-outline" style="font-size: 20px" />
            </Badge>
            <Dropdown style="margin-left: 20px" @on-click="handleClickMenu">
              <a href="javascript:void(0)">
                <img src="../../assets/images/avatar.png" alt class="avatar" />

                <!-- <img src="../../assets/images/setting.png" alt /> -->
                Admin
                <Icon type="md-arrow-dropdown" />
              </a>
              <dropdownMenu slot="list">
                <DropdownItem name="user" key="user">用户信息</DropdownItem>
                <DropdownItem name="password" key="password">修改密码</DropdownItem>
                <DropdownItem name="out" key="out">退出系统</DropdownItem>
              </dropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
      <div class="content-wrapper">
        <div class="content-padding">
          <bread />
          <router-view></router-view>
        </div>
      </div>
    </section>
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
  </main>
</template>

<script>
import menuNavDns from "./MenuDns";

export default {
  name: "DnsLayout",
  data() {
    return {
      visible: false,
      password: "",
      rePassword: ""
    };
  },
  components: {
    menuNavDns
  },
  methods: {
    handleClickMenu(name) {
      const self = this;
      if (name === "out") {
        self.SET_TOKEN("");
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
.main-content {
  position: absolute;
  margin: 0;
  bottom: 0px;
  top: 0px;
  background: #f4f3ef;
}

.content {
  height: 100%;
  overflow: auto;
}

.bread {
  padding: 20px;
}

.header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  padding-left: 240px;
  display: flow-root;
  height: 100px;
  box-sizing: border-box;
  box-shadow: 0 0 10px #66615b;
  .header-inner {
    position: relative;
    background: #f4f3ef;
    width: 100%;
    height: 100px;
    padding: 25px 30px;
    box-sizing: border-box;
    z-index: 10;
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
.content-wrapper {
  padding: 120px 40px 20px 40px;
  height: 100%;
}
.content-padding {
  background: #fff;
  height: 100%;
}
</style>