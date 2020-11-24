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
            v-if="$hasPermission('alarm', 'GET')"
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
      action="changePassword"
    />
    <common-modal
      :visible.sync="scopeAuthVisible"
      :width="750"
      title="权限范围"
      @confirm="scopeAuthVisible = false"
    >
      <Table
        style="overflow: visible"
        :columns="scopeColumns"
        :data="scopeData"
      />
    </common-modal>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import store from "@/store";
import logoSrc from "@/assets/images/logo.png";
import { USERTYPE_SUPER, USERTYPE_NORMAL } from "@/config";
import { resetRouter } from "@/router";

import ChangePassword from "@/components/ChangePassword";

const mainMenuList = [
  {
    title: "系统状态",
    url: "/monitor",
    module: "monitor",
    icon: "icon-statistics"
  },
  {
    title: "DNS管理",
    url: "/dns",
    module: "dns",
    icon: "icon-dns"

  },
  {
    title: "地址管理",
    url: "/address",
    module: "address",
    icon: "icon-computer"

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
    label: "权限范围",
    key: "getAuthorityInfo",
    permission: "user",
    onlyUser: true
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
    "change-password": ChangePassword
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
      scopeAuthVisible: false,
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
      scopeData: []

    };
  },
  computed: {
    ...mapGetters([
      "alarmCount"
    ]),
    mainMenuList() {
      const userType = this.userType;
      const { rangeList } = this.$store.getters;
      if (userType) {
        if (userType === USERTYPE_SUPER) {
          return mainMenuList;
        } else {
          return mainMenuList.filter(item => {
            return rangeList.includes(item.module);
          });
        }
      }
      return [];

    },
    userDropdownMenu() {
      const userType = this.userType;
      const resourceList = this.resourceList;
      if (userType === USERTYPE_SUPER) {
        return userDropdownMenu.filter(item => !item.onlyUser);
      } else {
        return userDropdownMenu.filter(item => {
          return resourceList.includes(item.permission) || item.permission === "*";
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
          const { username, userType, menuList } = userInfo;
          this.username = username;
          this.userType = userType;
          this.resourceList = Array.isArray(menuList) ? menuList.map(item => item.resource) : [];
        }
      }
    }
  },

  created() {
    console.log(this.$router, 55)

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
          path: "/auth/auth/user/group"
        });
      }

      if (name === "getAuthorityInfo") {
        this.scopeAuthVisible = true;
        const url = "/apis/linkingthing.com/auth/v1/users?action=getAuthorityInfo";
        this.$post({ url }).then(({ prefixs, views }) => {
          const result = []
          if (Array.isArray(prefixs)) {
            const list = prefixs.map(item => {
              return {
                ...item,
                dataType: "IP网段",
                content: item.semanticName
              };
            });
            result.push(...list);
          }

          if (Array.isArray(views)) {
            const list = views.map(item => {
              return {
                dataType: "视图",
                content: item
              };
            });
            result.push(...list);
          }
          this.scopeData = result;
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