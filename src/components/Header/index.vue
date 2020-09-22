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
          <img
            class="logo-text"
            :src="require('@/assets/images/logo-words.png')"
            alt=""
          >
        </div>
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
            <Icon
              :class="item.icon"
              style="font-size: 24px"
            />
            {{item.title}}
            </MenuItem>
          </Menu>
        </div>
        <div class="user">
          <Badge
            :count="alarmCount"
            v-if="$store.getters.hasPermissionToCreate"
          >
            <i
              class="icon-notice"
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
              >{{item.label}}
              </DropdownItem>

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
import logoSrc from "@/assets/images/logo.png";

import ChangePassword from "@/components/ChangePassword";

const mainMenuList = [
  {
    title: "系统状态",
    url: "/monitor",
    userType: "normalUser",
    icon: "icon-statistics"
  },
  {
    title: "DNS管理",
    url: "/dns",
    userType: "normalUser",
    icon: "icon-dns"

  },
  {
    title: "地址管理",
    url: "/address",
    userType: "normalUser",
    icon: "icon-computer"

  },
  {
    title: "系统管理",
    url: "/system",
    userType: "superUser",
    icon: "icon-system"

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
      userType: ""
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
        }
      }
    }
  },

  created() {
    const self = this;
    let ws = null;
    const baseConfig = {
      timer: null,
      baseUrl: "/apis/ws.linkingthing.com/v1",
      resource: "alarm",
      reconnectNumber: 3,
      reconnectDelay: 0
    };
    const { port, protocol, hostname } = document.location;
    const wsProtocol = protocol.includes("s") ? "wss" : "ws";
    const wsHost = process.env.NODE_ENV === "development" ? "10.0.0.120" : hostname;
    const wsPort = process.env.NODE_ENV === "development" ? "58081" : port;
    const wsUrl = `${wsProtocol}://${wsHost}:${wsPort}${baseConfig.baseUrl}/${baseConfig.resource}`;

    ws = new WebSocket(`${wsUrl}`);
    ws.onopen = function () {
      console.log("连接成功 初始化");
    };
    ws.onmessage = function (e) {
      const { count } = JSON.parse(e.data);
      self.alarmCount = count;
    };
    ws.onerror = function (e) {
      console.log(e);
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

@import "./../../assets/less/var.less";

.header {
  position: relative;
  height: @headerH;
  box-sizing: border-box;
  margin-bottom: 16px;

  .header-inner {
    position: relative;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    z-index: 100;
  }

  .logo {
    display: inline-flex;
    align-items: center;
    width: @menuWidth;
    vertical-align: middle;

    .logo-image {
      text-align: center;
      height: 60px;
      width: 56px;
      padding: 12px 0;
      margin-right: 10px;
      border-right: 1px solid #e8e8e8;
      img {
        width: 30px;
      }
    }

    img {
      vertical-align: middle;
    }

    h1 {
      display: inline-block;
      width: 185px;
      text-align: center;
      font-size: 18px;
      color: #fff;
      line-height: 20px;
      padding: 20px;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .logo-text {
    display: inline-block;
    vertical-align: middle;
    padding: 4px 0;
    width: 136px;
  }

  .main-menu {
    display: inline-block;
    vertical-align: middle;
    margin-left: 14px;

    .ivu-menu-horizontal.ivu-menu-light:after {
      display: none;
    }
    .ivu-menu-item {
      border-top: 0;
      border-bottom: 0;
      &:hover,
      &.ivu-menu-item-active {
        // background: rgba(69, 134, 254, 0.1);
        // border-top: 4px solid #4586fe;
      }
    }

    .ivu-menu-item {
      font-size: 16px;
      // font-weight: bold;
      margin-right: 30px;
    }
  }

  .user {
    font-size: 16px;
    float: right;
    margin-top: 12px;
    margin-right: 40px;

    .avatar {
      height: 36px;
      padding-right: 20px;
      vertical-align: middle;
      color: #cfcfcf;
      background: #f0f0f0;
      width: 36px;
      font-size: 20px;
      padding: 5px;
      border-radius: 50%;
      margin-right: 8px;
      background: url(./../../assets/images/avatar.png);
      background-size: cover;
      display: inline-block;
    }
  }
}
</style>