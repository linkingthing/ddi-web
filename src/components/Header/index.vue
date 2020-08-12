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
          <Badge :count="alarmCount">
            <i
              class="icon-header-notifications"
              style="font-size: 20px;cursor: pointer;color: #CFCFCF;vertical-align: middle;"
              @click="handleClickMessage"
            />
          </Badge>
          <Dropdown
            style="margin-left: 30px"
            @on-click="handleClickMenu"
          >
            <a href="javascript:void(0)">
              <i class="avatar icon-header-avatar" />
              {{username}}
              <Icon type="md-arrow-dropdown" />
            </a>
            <DropdownMenu slot="list">
              <DropdownItem
                v-for="item in userDropdownMenu"
                :name="item.key"
                :key="item.key"
              >{{item.label}}</DropdownItem>

            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
    <change-password
      :username="username"
      :visible.sync="visible"
    />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import store from "@/store";
import alarmWs from "@/util/ws";
import logoSrc from "@/assets/images/logo.png";

import ChangePassword from "@/components/ChangePassword";

const mainMenuList = [
  {
    title: "系统状态",
    url: "/monitor",
    userType: "superUser"
  },
  {
    title: "DNS管理",
    url: "/dns",
    userType: "normalUser"
  },
  {
    title: "地址管理",
    url: "/address",
    userType: "normalUser"
  },
  {
    title: "系统管理",
    url: "/system",
    userType: "superUser"
  }
];

const userDropdownMenu = [
  {
    label: "修改密码",
    key: "password",
    userType: "normalUser"
  },
  {
    label: "访问控制",
    key: "permissions",
    userType: "superUser"
  },
  {
    label: "退出系统",
    key: "out",
    userType: "normalUser"
  }
];



export default {
  name: "Header",

  components: {
    "change-password": ChangePassword
  },

  data() {

    return {
      logoSrc,
      currentMainMenu: "/monitor",
      visible: false,
      password: "",
      rePassword: "",
      alarmCount: 0,
      username: "",
      userType: "",
    };
  },
  computed: {
    mainMenuList() {
      const userType = this.userType;
      if (userType) {
        if (userType === "superUser") {
          return mainMenuList;
        } else {
          return mainMenuList.filter(item => {
            return item.userType === userType;
          });
        }
      }
      return [];

    },
    userDropdownMenu() {
      const userType = this.userType;
      if (userType === "superUser") {
        return userDropdownMenu;
      } else {
        return userDropdownMenu.filter(item => {
          return item.userType === userType;
        });
      }
    }
  },

  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(val) {
        const [, moduleName] = val.path.split("/");
        this.currentMainMenu = `/${moduleName}`;
      }
    },
    "$store.state.global": {
      deep: true,
      immediate: true,
      handler({ userInfo }) {
        if (userInfo) {
          const { user, userType } = userInfo;
          this.username = user;
          this.userType = userType;


          // if (userType === "superUser") {
          //   this.$router.push("/monitor");
          // }

          // if (userType === "normalUser") {
          //   this.$router.push("/dns/dns/views_zones");
          // }
        }
      }
    }
  },

  created() {

    alarmWs.getMessage = ({ count }) => {
      this.alarmCount = count;
    };
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
        const token = store.getters.token;
        const params = {
          token
        };
        this.$post({ url: "/apis/linkingthing.com/auth/v1/ddiusers/ddiuser?action=logout", params }).finally(() => {
          self.setToken("");
          self.$router.push({
            path: "/login"
          });
        });

      }
      if (name === "permissions") {
        self.$router.push({
          path: "/auth/auth/user/group"
        });
      }
      if (name === "password") {
        this.visible = true;
      }
    },
    handleClickMessage() {
      this.currentMainMenu = "/system";
      this.$router.push({ name: "alarm-notice", query: { state: "untreated" } });
    }

  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/var.less";

@import "./index.less";
</style>