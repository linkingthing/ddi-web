<template>
  <div class="header-wrapper">
    <div class="header">
      <div class="header-inner">
        <div class="logo">
          <div class="logo-image">
            <img
              :src="require('@/assets/images/logo.png')"
              alt
            >
          </div>
          <h1>DDI配置管理平台</h1>
        </div>
        <!-- <div class="logo-text">
          <img
            :src="logoTextSrc"
            alt
          >
        </div> -->
        <div class="main-menu">
          <Menu
            mode="horizontal"
            theme="light"
            :active-name="currentMainMenu"
            @on-select="handleClickMainMenu"
          >
            <MenuItem
              :name="item.url"
              v-for="item in mainMenuList"
              :key="item.url"
            >
              {{item.title}}
            </MenuItem>
          </Menu>
        </div>
        <div class="user">
          <!-- <Badge :count="3">
            <Icon type="ios-notifications-outline" style="font-size: 20px" />
          </Badge> -->
          <Dropdown
            style="margin-left: 20px"
            @on-click="handleClickMenu"
          >
            <a href="javascript:void(0)">
              <img
                src="../../assets/images/avatar.png"
                alt
                class="avatar"
              >
              Admin
              <Icon type="md-arrow-dropdown" />
            </a>
            <DropdownMenu slot="list">
              <DropdownItem
                name="user"
                key="user"
              >用户信息</DropdownItem>
              <DropdownItem
                name="password"
                key="password"
              >修改密码</DropdownItem>
              <DropdownItem
                name="out"
                key="out"
              >退出系统</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>

    <Modal
      v-model="visible"
      title="修改密码"
    >
      <Form
        :label-width="80"
        style="width: 400px;margin:0 auto"
      >
        <FormItem label="账号">admin</FormItem>
        <FormItem label="密码">
          <Input
            v-model="password"
            type="password"
            placeholder="请输入密码"
          />
        </FormItem>
        <FormItem label="再次输入">
          <Input
            v-model="rePassword"
            type="password"
            placeholder="请在此输入密码"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          size="large"
          @click="handleSubmit"
        >确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import services from "@/services";

import logoSrc from "@/assets/images/logo.png";

export default {
  name: "Header",
  data() {
    this.mainMenuList = [{
      title: "系统状态",
      url: "/monitor"
    }, {
      title: "DNS管理",
      url: "/dns"
    }, {
      title: "地址管理",
      url: "/address"
    }];
    return {
      logoSrc,
      currentMainMenu: "/monitor",
      visible: false,
      password: "",
      rePassword: ""
    };
  },
  created() {
    const [, moduleName] = this.$route.path.split("/");
    this.currentMainMenu = `/${moduleName}`;
  },
  methods: {
    ...mapMutations({
      setToken: "SET_TOKEN"
    }),

    handleClickMainMenu(menu) {      
      this.$router.push({ path: menu });
    },

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
@import "../../assets/less/var.less";

@import "./index.less";
</style>