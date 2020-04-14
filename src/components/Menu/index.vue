<template>
  <div class="menu">
    <div class="logo">
      <img src="../../assets/images/logo.png" alt >
    </div>
    <div class="menu-list">
      <vue-scroll class="pr" :ops="ops">
        <Menu
          :theme="theme"
          :active-name="tab"
          :open-names="$route.name.split('/')"
          :accordion="true"
        >
          <MenuGroup title="节点管理" v-if="PACK_SYSTEM.includes('node')">
            <MenuItem name="nodeManage" to="/node">
              <img :src="require('@/assets/images/node.png')" alt >
              节点管理
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="域名解析" v-if="PACK_SYSTEM.includes('dns')">
            <Submenu name="authority">
              <template slot="title">
                <img :src="require('@/assets/images/authority.png')" alt >
                权威管理
              </template>
              <MenuItem name="configGroup" to="/dns/authority/config">配置管理</MenuItem>
              <MenuItem name="redirectView" to="/dns/authority/redirectView">重定向</MenuItem>
            </Submenu>
            <MenuItem name="A4ComposeView" to="/dns/recursion/A4ComposeView">
              <img :src="require('@/assets/images/recursion.png')" alt >
              递归管理
            </MenuItem>
            <MenuItem name="zoneForward" to="/dns/forward/zoneForward">
              <img :src="require('@/assets/images/forward.png')" alt >
              转发管理
            </MenuItem>
            <Submenu name="accessControl">
              <template slot="title">
                <img :src="require('@/assets/images/access.png')" alt >
                访问控制
              </template>
              <MenuItem name="accessControlList" to="/dns/accessControl/accessControlList">访问控制列表</MenuItem>
              <MenuItem name="viewManage" to="/dns/accessControl/viewManage">视图管理</MenuItem>
              <MenuItem name="priority" to="/dns/accessControl/priority">解析优先级</MenuItem>
            </Submenu>
            <Submenu name="safe">
              <template slot="title">
                <img :src="require('@/assets/images/safe.png')" alt >
                安全管理
              </template>
              <MenuItem name="blacklistAndwhitelist" to="/dns/safe/blacklistAndwhitelist">安全管理</MenuItem>
              <MenuItem name="developmentcontrol" to="/dns/safe/developmentcontrol">并发控制</MenuItem>
            </Submenu>
          </MenuGroup>
          <MenuGroup title="地址管理" v-if="PACK_SYSTEM.includes('address')">
            <Submenu name="address-manage">
              <template slot="title">
                <img :src="require('@/assets/images/address.png')" alt >
                地址管理
              </template>
              <MenuItem name="/address-manage/child-net" to="/address-manage/child-net">子网管理</MenuItem>
              <MenuItem name="/address-manage/device-manage" to="/address-manage/device-manage">设备管理</MenuItem>
              <MenuItem
                name="/address-manage/option-config"
                to="/address-manage/option-config"
              >OPTION配置</MenuItem>
              <MenuItem name="/address-manage/tree" to="/address-manage/tree">地址规划</MenuItem>
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
      tab: this.$route.params.tab || this.$route.name // 路由tab
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
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>