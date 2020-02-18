<template>
  <header class="clearfix">
    <div class="header-main">
      <div class="header-left fl clearfix">
        <img class="fl" src="../../assets/images/login.png" alt="logo" />
        <p class="title fl">
          <span class="line"></span>
          DDI配置管理平台
        </p>
      </div>
      <div class="header-nav clearfix" :class="path">
        <router-link class="nav-list fl" to="/node">仪表盘</router-link>
        <router-link class="nav-list fl" to="/dns">域名解析</router-link>
        <!-- <router-link class="nav-list fl" to="/dhcp">地址管理</router-link>
        <router-link class="nav-list fl" to="/sys">系统管理</router-link>-->
      </div>
      <div class="header-right clearfix">
        <div class="user-pic fl">
          <Avatar :src="require('../../assets/images/icon-people.png')" />
        </div>
        <div class="nva fl">
          <Dropdown style="margin-left: 20px" @on-click="handleClickMenu">
            <a href="javascript:void(0)">
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
  </header>
</template>

<script>
import { mapMutations } from "vuex";
import services from "@/services";
export default {
  name: "Header",
  data() {
    return {
      visible: false,
      // loading: true,
      password: "",
      rePassword: "",
      path: this.$route.meta.range
    };
  },

  methods: {
    ...mapMutations(["SET_TOKEN"]),
    // 菜单跳转
    handleClickMenu(name) {
      const self = this;
      if (name === "out") {
        self.SET_TOKEN("");
        self.$router.push({
          path: "/login"
        });
      }
      if (name === "password") {
        console.log("pa");
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

<style scoped>
</style>
