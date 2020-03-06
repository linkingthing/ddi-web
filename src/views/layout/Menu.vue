<template>
  <div class="menu fl left-menu">
    <div class="logo">
      <img src="../../assets/images/logo.png" alt />
    </div>
    <div class="menu-list">
      <vue-scroll class="pr">
        <Menu :theme="theme" :active-name="tab" :open-names="['1']" :accordion="true">
          <MenuGroup title="节点管理">
            <MenuItem name="nodeManage" to="/node">
              <Icon type="ios-git-network" />节点管理
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="域名解析">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-aperture-outline"></Icon>权威管理
              </template>
              <MenuItem name="configGroupMg" to="/dns/authority/config">权威管理</MenuItem>
              <MenuItem name="redirectView" to="/dns/authority/redirectView">重定向</MenuItem>
            </Submenu>

            <!-- <Submenu name="6">
              <template slot="title">
                <Icon type="ios-git-branch" />递归管理
            </template>-->
            <MenuItem name="A4Compose" to="/dns/recursion/A4ComposeView">
              <Icon type="ios-git-branch" />递归管理
            </MenuItem>
            <!-- <MenuItem name="defaultA4Compose" to="/dns/recursion/defaultA4Compose">默认4A地址合成</MenuItem> -->
            <!-- </Submenu> -->

            <!-- <Submenu name="7">
              <template slot="title">
                <Icon type="ios-arrow-round-forward" />转发管理
            </template>-->
            <MenuItem name="zoneForward" to="/dns/forward/zoneForward">
              <Icon type="ios-arrow-round-forward" />转发管理
            </MenuItem>
            <!-- <MenuItem name="defaultForward" to="/dns/forword/defaultForward">默认转发</MenuItem> -->
            <!-- </Submenu> -->
            <!-- <MenuItem name="accessControlList" to="/dns/accessControl/accessControlList">访问控制</MenuItem> -->

            <Submenu name="4">
              <template slot="title">
                <Icon type="ios-eye-outline" />访问控制
              </template>
              <MenuItem name="accessControlList" to="/dns/accessControl/accessControlList">访问控制列表</MenuItem>
              <MenuItem name="viewManage" to="/dns/accessControl/viewManage">视图管理</MenuItem>
            </Submenu>
            <Submenu name="5">
              <template slot="title">
                <Icon type="ios-medkit-outline" />安全管理
              </template>
              <!-- <MenuItem name="logStatistics" to="/dns/logStatistics">DDOS防护</MenuItem> -->
              <MenuItem name="blacklistAndwhitelist" to="/dns/blacklistAndwhitelist">安全管理</MenuItem>
              <MenuItem name="developmentcontrol" to="/dns/developmentcontrol">并发控制</MenuItem>
            </Submenu>
          </MenuGroup>

          <MenuGroup title="地址管理">
            <Submenu name="6">
              <template slot="title">
                <Icon type="ios-aperture-outline" />地址管理
              </template>
              <MenuItem name="child-net" to="/address-manage/child-net">子网管理</MenuItem>
              <MenuItem name="device-manage" to="/address-manage/device-manage">设备管理</MenuItem>
              <MenuItem name="option-config" to="/address-manage/option-config">OPTION配置</MenuItem>
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
    return {
      theme: "light", // menu主题
      tab: this.$route.params.tab || this.$route.name //路由tab
    };
  },
  computed: {
    openName() {
      let name = this.tab;
      // 应用升级
      if (
        name == "appUpgrade" ||
        name == "configGroupMg" ||
        name == "parameterSet"
      ) {
        return "1";
      }
      // 网络转换
      if (
        name == "IPv6网络转换" ||
        name == "NAT64" ||
        name == "NAT66" ||
        name == "组播"
      ) {
        return "2";
      }
      // 集群管理
      if (name == "clusterMg" || name == "deviceMg") {
        return "3";
      }
      // 监控告警
      if (
        name == "eviceStatistics" ||
        name == "deviceMonitor" ||
        name == "alarmList" ||
        name == "alarmSet"
      ) {
        return "4";
      }
      // 溯源审计
      if (name == "logStatistics") {
        return "5";
      }
      // QOS配置
      if (
        name == "limitingUserBroadband" ||
        name == "limitingWebsiteBroadband" ||
        name == "restrictWebsiteVisits"
      ) {
        return "6";
      }
      // 网络安全
      if (name == "networkSecurity" || name == "applicationFirewall") {
        return "7";
      }
    }
  },
  watch: {
    $route(to, from) {
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
  color: #515a6e;
}

.left-menu {
  height: 100%;
}
</style>