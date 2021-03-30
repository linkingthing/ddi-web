<template>
  <div class="header-wrapper">
    <div class="header">
      <div class="header-inner">
        <div class="logo">
          <img
            src="logo.png"
            alt="logo"
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

          <i
            class="header-icon search-icon"
            @click="searchVisible = true"
          ></i>

          <Badge
            :count="alarmCount"
            v-if="$hasPermission('alarm', 'GET')"
          >
            <i
              class="notice header-icon"
              style="font-size: 20px;cursor: pointer;color: #CFCFCF;vertical-align: middle;"
              @click="handleClickMessage"
            />
          </Badge>
          <Dropdown
            style="margin-left: 36px"
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

          <Icon
            :type="showAgentEvent? 'ios-arrow-dropup' : 'ios-arrow-dropdown'"
            style="font-size: 20px; cursor: pointer"
            @click="showAgentEvent = !showAgentEvent"
          />
        </div>
      </div>
    </div>
    <change-password
      :username="username"
      :visible.sync="visible"
      action="changePassword"
    />

    <div
      class="message-list"
      v-if="showAgentEvent"
    >
      <div class="message-title">配置返显</div>
      <div class="message-group">
        <div
          class="message-item"
          v-for="item in agentEventAll"
          :key="item.id"
        >
          <div style="margin-right: 10px">
            <Icon
              style="font-size: 24px;color: #59BB73"
              type="ios-checkmark-circle-outline"
              v-if="item.succeed"
            />
            <Icon
              style="font-size: 24px;color: #FF6464"
              type="ios-warning-outline"
              v-else
            />
          </div>
          <div>
            <h3 class="message-item-title">{{item.node}}
              <Icon
                style="font-size: 16px;color: #999; cursor: pointer"
                custom="icon-detail"
                @click="handleOpenMessage(item)"
              />
            </h3>
            <p class="message-item-content">{{item.message}}</p>
          </div>
          <div class="message-item-info">
            <time>{{item.operationTime.split(" ").join("\n")}}</time>
          </div>
        </div>
      </div>

    </div>

    <QuickSearch :visible.sync="searchVisible" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import store from "@/store";
import logoSrc from "@/assets/images/logo.png";
import { resetRouter } from "@/router";

import ChangePassword from "@/components/ChangePassword";
import QuickSearch from "./QuickSearch";

const mainMenuList = [
  {
    title: "系统详情",
    url: "/monitor",
    module: "monitor",
    icon: "icon-statistics"
  },
  {
    title: "资产治理",
    url: "/address",
    module: "address",
    icon: "icon-computer"
  },
  {
    title: "域名服务",
    url: "/dns",
    module: "dns",
    icon: "icon-dns"
  },
  {
    title: "系统管理",
    url: "/system",
    module: "system",
    icon: "icon-system"

  }
];

const userDropdownMenu = [
  {
    label: "修改密码",
    key: "password",
    permission: "user"
  },
  {
    label: "访问控制",
    key: "permissions",
    permission: "super"
  },

  {
    label: "退出系统",
    key: "out",
    permission: "*"
  }
];



export default {
  name: "Header",

  components: {
    "change-password": ChangePassword,
    QuickSearch
  },

  data() {
    return {
      logoSrc,
      currentMainMenu: "/monitor",
      visible: false,
      password: "",
      rePassword: "",
      username: "",
      userType: "",
      resourceList: [],
      showAgentEvent: false,
      scopeAuthVisible: false,
      searchVisible: false,
      scopeColumns: [{
        title: "数据类型",
        key: "dataType"
      }, {
        title: "内容",
        key: "content",
        render: (h, { row }) => {
          row.prefixs = row.prefixs || [];
          row.ipv4Subnets = row.ipv4Subnets || [];
          const list = [...row.prefixs, ...row.ipv4Subnets];
          return h("Tooltip", {
            props: {
              disabled: !list.length
            },
            scopedSlots: {
              content: (props) => {
                return list.map(item => {
                  return h("div", item);
                });
              }
            }

          }, row.content)
        }
      }],

    };
  },
  computed: {
    ...mapGetters([
      "alarmCount",
      "agentEventAll"
    ]),

    mainMenuList() {

      return mainMenuList;

      // const userType = this.userType;
      // const { rangeList } = this.$store.getters;
      // if (userType) {
      //   if (userType === USERTYPE_SUPER) {
      //     return mainMenuList;
      //   } else {
      //     return mainMenuList.filter(item => {
      //       return rangeList.includes(item.module);
      //     });
      //   }
      // }
      // return [];

    },
    userDropdownMenu() {
      return userDropdownMenu;
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
          const { username, userType, menuList } = userInfo;
          this.username = username;
          this.userType = userType;
          this.resourceList = Array.isArray(menuList) ? menuList.map(item => item.resource) : [];
        }
      }
    }
  },

  created() {

  },

  methods: {
    ...mapMutations({
      setToken: "SET_TOKEN",
      setRoutes: "setRoutes"
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
        this.$post({ url: "/apis/linkingthing.com/auth/v1/users/user?action=logout", params }).finally(() => {
          self.setToken("");
          self.setRoutes([]);
          resetRouter();
          self.$router.push({
            path: "/login"
          });
        });

      }
      if (name === "permissions") {
        self.$router.push({
          path: "/auth/auth/whitelists"
        });
      }

     
      if (name === "password") {
        this.visible = true;
      }
    },
    handleClickMessage() {
      this.currentMainMenu = "/system";
      this.$router.push({ name: "alarm-notice", query: { state: "untreated" } });
    },
    handleOpenMessage(row) {
      let cmdMessage = JSON.stringify(JSON.parse(row.cmdMessage), null, 2);
      let errMessage = row.errorMessage ? `错误信息：${row.errorMessage}` : "操作成功";

      cmdMessage = cmdMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      errMessage = errMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      this.$Modal.info({
        scrollable: true,
        width: 800,
        title: "详细信息",
        content: `<pre>${cmdMessage}</pre><br /> <pre>${errMessage}</pre>`
      });
    },

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
    justify-content: center;

    .logo-image {
      text-align: center;
      height: 60px;
      width: 56px;
      padding: 12px 0;
      margin-right: 15px;
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
    width: 124px;
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
      height: 24px;
      padding-right: 20px;
      vertical-align: middle;
      color: #cfcfcf;
      background: #f0f0f0;
      width: 24px;
      font-size: 20px;
      padding: 5px;
      border-radius: 50%;
      margin-right: 8px;
      background: url(./avatar.png);
      background-size: cover;
      display: inline-block;
    }
  }

  .header-icon {
    display: inline-block;
    height: 24px;
    width: 24px;
  }
  .notice {
    background: url(./info.png);
  }
  .search-icon {
    background: url(./search.png);
    margin-right: 36px;
    vertical-align: middle;
    cursor: pointer;
  }
}

.message-list {
  position: fixed;
  display: flex;
  flex-direction: column;
  right: 0;
  top: 60px;
  bottom: 0;
  width: 300px;
  background: #fff;
  z-index: 100;
  border: 1px solid #ddd;
  box-shadow: 0px 0px 46px 0px rgba(120, 120, 120, 0.15);
  .message-title {
    top: 60px;
    right: 0;
    height: 54px;
    line-height: 54px;
    color: #333;
    padding: 0 20px;
    font-size: 16px;
    width: 300px;
    border-bottom: 1px solid #e6e6e6;
    background: #fff;
    z-index: 10;
  }
  .message-group {
    padding: 20px;
    overflow: auto;
    flex: 1;
  }
  .message-item {
    display: flex;
    margin-bottom: 12px;
    .message-item-title {
      font-size: 16px;
      color: #333;
    }
    .message-item-content {
      font-size: 14px;
      color: #666;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      max-width: 200px;
    }
    time {
      font-size: 12px;
      color: #999;
      white-space: pre;
    }
    .message-item-info {
      text-align: right;
      margin-left: auto;
    }
  }
}
</style>