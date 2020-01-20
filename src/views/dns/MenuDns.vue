<template>
  <div class="menu fl left-menu">
    <div class="menu-list">
      <vue-scroll  class="pr">
        <Menu :theme="theme" :active-name="tab" :open-names="[openName]" :accordion="true">
          <Submenu name="1">
            <template slot="title">
              <Icon type="navicon-round"></Icon>权威管理
            </template>
            <MenuItem name="configGroupMg" to="/dns/configGroupMg">配置管理</MenuItem>
            <MenuItem name="parameterSet" to="/dns/parameterSet">重定向</MenuItem>
          </Submenu>

          <Submenu name="6">
            <template slot="title">
              <Icon type="navicon-round"></Icon>递归管理
            </template>

            <MenuItem name="limitingWebsiteBroadband" to="/dns/limitingWebsiteBroadband">默认4A地址合成</MenuItem>
            <MenuItem name="limitingUserBroadband" to="/dns/limitingUserBroadband">4A地址合成</MenuItem>
          </Submenu>

          <Submenu name="7">
            <template slot="title">
              <Icon type="navicon-round"></Icon>转发管理
            </template>
            <MenuItem name="networkSecurity" to="/dns/networkSecurity">默认转发</MenuItem>
            <MenuItem name="applicationFirewall" to="/dns/applicationFirewall">区转发</MenuItem>
          </Submenu>

          <Submenu name="4">
            <template slot="title">
              <Icon type="navicon-round"></Icon>访问控制
            </template>
            <MenuItem name="eviceStatistics" to="/dns/eviceStatistics">访问控制列表</MenuItem>
            <MenuItem name="deviceMonitor" to="/dns/deviceMonitor">视图管理</MenuItem>
          </Submenu>
          <Submenu name="5">
            <template slot="title">
              <Icon type="navicon-round"></Icon>安全管理
            </template>
            <MenuItem name="logStatistics" to="/dns/logStatistics">DDOS防护</MenuItem>
            <MenuItem name="blacklistAndwhitelist" to="/dns/blacklistAndwhitelist">地址黑名单</MenuItem>
            <MenuItem name="developmentcontrol" to="/dns/developmentcontrol">并发控制</MenuItem>
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
    return {
      theme: "light", // menu主题
      tab: this.$route.params.tab || this.$route.name //路由tab
    };
  },
  mounted() {
    const slef = this;

    this.getDocHeight();
    window.onresize = () => {
      slef.getDocHeight();
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
  methods: {
  
  }
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