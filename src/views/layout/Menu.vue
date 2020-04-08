<template>
  <div class="menu">
    <div class="logo">
      <img src="../../assets/images/logo.png" alt />
    </div>
    <div class="menu-list">
      <vue-scroll class="pr" :ops="ops">
        <Menu
          :theme="theme"
          :active-name="tab"
          :open-names="['authority', 'accessControl']"
          :accordion="true"
        >
          <MenuGroup title="节点管理" v-if="PACK_SYSTEM.includes('node')">
            <MenuItem name="nodeManage" to="/node">
              <img :src="require('@/assets/images/node.png')" alt />
              节点管理
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="域名解析" v-if="PACK_SYSTEM.includes('dns')">
            <Submenu name="authority">
              <template slot="title">
                <img :src="require('@/assets/images/authority.png')" alt />
                权威管理
              </template>
              <MenuItem name="configGroupMg" to="/dns/authority/config">权威管理</MenuItem>
              <MenuItem name="redirectView" to="/dns/authority/redirectView">重定向</MenuItem>
            </Submenu>
            <MenuItem name="A4Compose" to="/dns/recursion/A4ComposeView">
              <img :src="require('@/assets/images/recursion.png')" alt />
              递归管理
            </MenuItem>
            <MenuItem name="zoneForward" to="/dns/forward/zoneForward">
              <img :src="require('@/assets/images/forward.png')" alt />
              转发管理
            </MenuItem>
            <Submenu name="accessControl">
              <template slot="title">
                <img :src="require('@/assets/images/access.png')" alt />
                访问控制
              </template>
              <MenuItem name="accessControlList" to="/dns/accessControl/accessControlList">访问控制列表</MenuItem>
              <MenuItem name="viewManage" to="/dns/accessControl/viewManage">视图管理</MenuItem>
              <MenuItem name="priority" to="/dns/accessControl/priority">解析优先级</MenuItem>
            </Submenu>
            <Submenu name="5">
              <template slot="title">
                <img :src="require('@/assets/images/safe.png')" alt />
                安全管理
              </template>
              <MenuItem name="blacklistAndwhitelist" to="/dns/blacklistAndwhitelist">安全管理</MenuItem>
              <MenuItem name="developmentcontrol" to="/dns/developmentcontrol">并发控制</MenuItem>
            </Submenu>
          </MenuGroup>
          <MenuGroup title="地址管理" v-if="PACK_SYSTEM.includes('address')">
            <Submenu name="6">
              <template slot="title">
                <img :src="require('@/assets/images/address.png')" alt />
                地址管理
              </template>
              <MenuItem name="child-net" to="/address-manage/child-net">子网管理</MenuItem>
              <MenuItem name="device-manage" to="/address-manage/device-manage">设备管理</MenuItem>
              <MenuItem name="option-config" to="/address-manage/option-config">OPTION配置</MenuItem>
              <MenuItem name="tree-config" to="/address-manage/tree">地址规划</MenuItem>
            </Submenu>
          </MenuGroup>
        </Menu>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
export default {
  name: "menuNav",
  data() {
    // eslint-disable-next-line no-undef
    this.PACK_SYSTEM = PACK_SYSTEM;
    this.ops = {
      bar: {
        hoverStyle: true,
        onlyShowBarOnScroll: true,
        background: "#d5d5d5"
      }
    };
    return {
      theme: "dark",
      tab: this.$route.params.tab || this.$route.name //路由tab
    };
  },

  watch: {
    $route() {
      if (this.$route.params.tab) {
        this.tab = this.$route.params.tab;
      } else {
        this.tab = this.$route.name;
      }
    }
  },
  methods: {}
};
</script>

<style lang="less">
.menu {
  position: absolute;
  top: 0;
  bottom: 0;
  padding-bottom: 50px;
  float: left;
  background-color: #455484;
  .logo {
    height: 86px;
    padding: 20px;
    border-bottom: 1px solid #cfcfca;
  }
  .ivu-menu .ivu-menu {
    padding-left: 14px;
  }
  .ivu-menu-dark.ivu-menu-vertical
    .ivu-menu-item-active:not(.ivu-menu-submenu) {
    background: #455484;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
    background: #455484;
  }
  .ivu-menu-dark.ivu-menu-vertical
    .ivu-menu-item-active:not(.ivu-menu-submenu) {
    color: #f8b16b;
    // background: #f4f3ef;
    &::after {
      position: absolute;
      left: -14px;
      top: 8px;
      display: block;
      content: "";
      width: 210px;
      height: 30px;
      border-radius: 0px 20px 20px 0px;
      background: #f4f3ef;
      z-index: -1;
    }
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active {
    color: #f8b16b;
    background: #455484 !important;
    &:hover {
      background: none !important;
      color: #f8b16b;
    }
  }
}
.menu-list img {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  vertical-align: middle;
  margin-top: -5px;
}
</style>