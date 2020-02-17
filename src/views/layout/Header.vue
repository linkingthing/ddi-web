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
  </header>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "Header",
  data() {
    return {
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
    }
  }
};
</script>

<style scoped>
</style>
