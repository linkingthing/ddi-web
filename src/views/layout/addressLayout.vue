<template>
  <main class="main-content">
    <!-- 菜单 -->    
    <div class="menu fl left-menu">
      <div class="logo">
        <img src="../../assets/images/logo.png" alt />
      </div>
      <div class="menu-list">
        <vue-scroll class="pr">
          <Menu :theme="theme" :active-name="tab" :open-names="['1']" :accordion="true">
            <MenuGroup title="地址管理">
              <Submenu name="1">
                <template slot="title">
                  <Icon type="ios-aperture-outline" />地址管理
                </template>
                <MenuItem name="child-net" to="/address-manage/child-net">子网管理</MenuItem>
                <MenuItem name="device-manage" to="/address-manage/device-manage">设备管理</MenuItem>
                <MenuItem name="option-config" to="/address-manage/option-config">OPTION配置</MenuItem>
              </Submenu>
            </MenuGroup>
          </Menu>
        </vue-scroll>
      </div>
    </div>
    
    <section class="content">
      <div class="header">
        <div class="bread">

        </div>

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
      <div class="content-wrapper">
        <!-- <bread /> -->
        <router-view></router-view>
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
export default {
  name: "LayoutAddress",

  data() {
    return {
      visible: false,
      password: "",
      rePassword: "",
      theme: "light", // menu主题
      tab: this.$route.params.tab || this.$route.name //路由tab
    };
  },

  watch: {
    $route(to, from) {
      if (this.$route.params.tab) {
        this.tab = this.$route.params.tab;
      } else {
        this.tab = this.$route.name;
      }
    }
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
    },
  },
};
</script>

<style lang="less" scoped>
.main-content {
  position: absolute;
  margin: 0;
  bottom: 0px;
  top: 0px;
  background: #f4f3ef;

  .menu{
    height: 100%;
  }

  .content {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  .bread {
    padding: 20px;
  }

  .header {
    height: 100px;
    box-sizing: border-box;
    padding: 25px 30px;
    // border-bottom: 1px solid #66615b;

    .bread {
      float: left;
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
    background: #fff;
    margin: 0 40px 20px;
    // height: calc(100% - 120px);
    flex: 1
  }
}
</style>