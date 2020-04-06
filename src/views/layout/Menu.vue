<template>
  <div class="menu fl left-menu">
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
              <Icon type="ios-git-network" />节点管理
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="域名解析" v-if="PACK_SYSTEM.includes('dns')">
            <Submenu name="authority">
              <template slot="title">
                <Icon type="ios-aperture-outline"></Icon>权威管理
              </template>
              <MenuItem name="configGroupMg" to="/dns/authority/config">权威管理</MenuItem>
              <MenuItem name="redirectView" to="/dns/authority/redirectView">重定向</MenuItem>
            </Submenu>
            <MenuItem name="A4Compose" to="/dns/recursion/A4ComposeView">
              <Icon type="ios-git-branch" />递归管理
            </MenuItem>
            <MenuItem name="zoneForward" to="/dns/forward/zoneForward">
              <Icon type="ios-arrow-round-forward" />转发管理
            </MenuItem>
            <Submenu name="accessControl">
              <template slot="title">
                <Icon type="ios-eye-outline" />访问控制
              </template>
              <MenuItem name="accessControlList" to="/dns/accessControl/accessControlList">访问控制列表</MenuItem>
              <MenuItem name="viewManage" to="/dns/accessControl/viewManage">视图管理</MenuItem>
              <MenuItem name="priority" to="/dns/accessControl/priority">解析优先级</MenuItem>
            </Submenu>
            <Submenu name="5">
              <template slot="title">
                <Icon type="ios-medkit-outline" />安全管理
              </template>
              <MenuItem name="blacklistAndwhitelist" to="/dns/blacklistAndwhitelist">安全管理</MenuItem>
              <MenuItem name="developmentcontrol" to="/dns/developmentcontrol">并发控制</MenuItem>
            </Submenu>
          </MenuGroup>
          <MenuGroup title="地址管理" v-if="PACK_SYSTEM.includes('address')">
            <Submenu name="6">
              <template slot="title">
                <Icon type="ios-aperture-outline" />地址管理
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
      theme: "light",
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

<style scoped>
a:link,
a:visited,
a:hover,
a:active {
  color: #d1d0ce;
}

.left-menu {
  height: 100%;
}

.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  color: #fff;
}
</style>