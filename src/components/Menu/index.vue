<template>
  <div class="menu">
    <div class="logo">
      <img src="../../assets/images/logo.png" alt >
    </div>
    <div class="menu-list">
      <vue-scroll :ops="ops">
        <Menu
          :theme="theme"
          :active-name="tab"
          :open-names="openNames"
          :accordion="true"
        >
          <MenuItem
            class="node-manage"
            v-if="PACK_SYSTEM.includes('node')"
            name="node-manage"
            to="/node">
            <img :src="require('@/assets/images/node.png')" alt >
            节点管理
          </MenuItem>
          
          <Submenu name="address-manage" v-if="PACK_SYSTEM.includes('address')">
            <template slot="title">
              <img :src="require('@/assets/images/access.png')" alt >
              IPAM管理
            </template>
            <MenuItem name="ip-address-manage" to="/address-manage/child-net">IP地址管理</MenuItem>
            <MenuItem name="ip-address-devide" to="/address-manage/tree">IP地址划分</MenuItem>
          </Submenu>
          
          <Submenu name="dns-service" v-if="PACK_SYSTEM.includes('dns')">
            <template slot="title">
              <img :src="require('@/assets/images/authority.png')" alt >
              DNS服务
            </template>
            <MenuItem name="config-group" to="/dns/authority/config">权威管理</MenuItem>
            <MenuItem name="redirect-view" to="/dns/authority/redirectView">重定向</MenuItem>
            <MenuItem name="a4-compose-view" to="/dns/recursion/A4ComposeView">递归管理</MenuItem>
            <MenuItem name="zone-forward" to="/dns/forward/zoneForward">转发管理</MenuItem>
          </Submenu>
          
          <Submenu name="access-control" v-if="PACK_SYSTEM.includes('dns')">
            <template slot="title">
              <img :src="require('@/assets/images/access.png')" alt >
              访问控制
            </template>
            <MenuItem name="access-control-list" to="/dns/accessControl/accessControlList">访问控制列表</MenuItem>
            <MenuItem name="view-manage" to="/dns/accessControl/viewManage">视图管理</MenuItem>
            <MenuItem name="priority" to="/dns/accessControl/priority">解析优先级</MenuItem>
          </Submenu>
          
          <Submenu name="dhcp-service" v-if="PACK_SYSTEM.includes('address')">
            <template slot="title">
              <img :src="require('@/assets/images/access.png')" alt >
              DHCP服务
            </template>
            <MenuItem name="address-pool-manage" to="/address-manage/option-config">地址池管理</MenuItem>
            <MenuItem name="option-config" to="/address-manage/option-config">OPTION配置</MenuItem>
          </Submenu>
          
          <Submenu name="safe">
            <template slot="title">
              <img :src="require('@/assets/images/safe.png')" alt >
              系统安全
            </template>
            <MenuItem name="blacklist-and-white-list" to="/dns/safe/blacklistAndwhitelist">安全管理</MenuItem>
            <MenuItem name="development-control" to="/dns/safe/developmentcontrol">并发控制</MenuItem>
          </Submenu>
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
    
    return {
      theme: "dark",
      openNames: [
        "address-manage",
        "dns-service",
        "access-control",
        "dhcp-service",
        "safe"
      ],
      ops: {
        vuescroll: {
          mode: "native",
          sizeStrategy: "percent",
          detectResize: true
        }
      },
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