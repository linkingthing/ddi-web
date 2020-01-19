<template>
    <div class="menu fl">
        <!-- <p class="title">菜单栏</p> -->
        <div class="menu-list">
            <vue-scroll :style="{minHeight:docHeight-200+'px'}" class="pr">
                <Menu :theme="theme" :active-name="tab" :open-names="[openName]" :accordion="true">
                    <!-- <MenuItem name="space6" to="/space6Layout/space6">
                        <Icon type="ios-home" />
                        仪表盘
                    </MenuItem> -->
                    <!-- <Submenu name='1'>
                        <template slot="title">
                            <Icon type="md-menu"></Icon>应用升级
                        </template>
                        <MenuItem name="appUpgrade" to="/space6Layout/appUpgrade">升级列表</MenuItem>
                        <MenuItem name="configGroupMg" to="/space6Layout/configGroupMg">配置组管理</MenuItem>
                        <MenuItem name="parameterSet" to="/space6Layout/parameterSet">参数设置</MenuItem>
                    </Submenu> -->
                    <Submenu name='1'>
                        <template slot="title">
                            <Icon type="navicon-round"></Icon>权威管理
                        </template>
                        <!-- <MenuItem name="appUpgrade" to="/space6Layout/appUpgrade">升级列表</MenuItem> -->
                        <MenuItem name="configGroupMg" to="/space6Layout/configGroupMg">配置管理</MenuItem>
                        <MenuItem name="parameterSet" to="/space6Layout/parameterSet">重定向</MenuItem>
                    </Submenu>
                    <!-- <Submenu name='6'>
                        <template slot="title">
                            <Icon type="md-menu"></Icon>流量控制
                        </template>
                        <MenuItem name="limitingUserBroadband" to="/space6Layout/limitingUserBroadband">用户带宽</MenuItem>
                        <MenuItem name="limitingWebsiteBroadband" to="/space6Layout/limitingWebsiteBroadband">应用带宽</MenuItem>
                        <MenuItem name="restrictWebsiteVisits" to="/space6Layout/restrictWebsiteVisits">应用并发量</MenuItem>
                    </Submenu> -->
                    <Submenu name='6'>
                        <template slot="title">
                            <Icon type="navicon-round"></Icon>递归管理
                        </template>
                        
                        <MenuItem name="limitingWebsiteBroadband" to="/space6Layout/limitingWebsiteBroadband">默认4A地址合成</MenuItem>
                        <MenuItem name="limitingUserBroadband" to="/space6Layout/limitingUserBroadband">4A地址合成</MenuItem>
                        <!-- <MenuItem name="restrictWebsiteVisits" to="/space6Layout/restrictWebsiteVisits">A4地址合成</MenuItem> -->
                    </Submenu>
                    <!-- <Submenu name='7'>
                        <template slot="title">
                            <Icon type="md-menu"></Icon>网络安全
                        </template> -->
                        <!-- <MenuItem name="networkSecurity" to="/space6Layout/networkSecurity">网络安全防护</MenuItem> -->
                        <!-- <MenuItem name="applicationFirewall" to="/space6Layout/applicationFirewall">应用防火墙</MenuItem>
                    </Submenu> -->
                    <Submenu name='7'>
                        <template slot="title">
                            <Icon type="navicon-round"></Icon>转发管理
                        </template>
                        <MenuItem name="networkSecurity" to="/space6Layout/networkSecurity">默认转发</MenuItem>
                        <MenuItem name="applicationFirewall" to="/space6Layout/applicationFirewall">区转发</MenuItem>
                    </Submenu>
                    <!-- <Submenu name='4'>
                        <template slot="title">
                            <Icon type="md-menu"></Icon>监控告警
                        </template>
                        <MenuItem name="eviceStatistics" to="/space6Layout/eviceStatistics">集群/设备统计</MenuItem>
                        <MenuItem name="deviceMonitor" to="/space6Layout/deviceMonitor">设备监控</MenuItem>
                        <MenuItem name="alarmList" to="/space6Layout/alarmList">告警列表</MenuItem>
                        <MenuItem name="alarmSet" to="/space6Layout/alarmSet">告警设置</MenuItem>
                    </Submenu> -->
                    <Submenu name='4'>
                        <template slot="title">
                            <Icon type="navicon-round"></Icon>访问控制
                        </template>
                        <MenuItem name="eviceStatistics" to="/space6Layout/eviceStatistics">访问控制列表</MenuItem>
                        <MenuItem name="deviceMonitor" to="/space6Layout/deviceMonitor">视图管理</MenuItem>
                        <!-- <MenuItem name="alarmList" to="/space6Layout/alarmList">告警列表</MenuItem>
                        <MenuItem name="alarmSet" to="/space6Layout/alarmSet">告警设置</MenuItem> -->
                    </Submenu>
                    <Submenu name='5'>
                        <template slot="title">
                            <Icon type="navicon-round"></Icon>安全管理
                        </template>
                        <MenuItem name="logStatistics" to="/space6Layout/logStatistics">DDOS防护</MenuItem>
                        <MenuItem name="blacklistAndwhitelist" to="/space6Layout/blacklistAndwhitelist">地址黑名单</MenuItem>
                        <MenuItem name="developmentcontrol" to="/space6Layout/developmentcontrol">并发控制</MenuItem>
                    </Submenu>
                    <!-- <MenuItem name="appUpgradeBusinessAnalysis" to="/space6Layout/appUpgradeBusinessAnalysis">
                        <Icon type="md-trending-up" />
                        统计分析
                    </MenuItem> -->
                    <!-- <Submenu name='2'>
                        <template slot="title">
                            <Icon type="navicon-round"></Icon>系统管理
                        </template>
                        <MenuItem name="registration" to="/space6Layout/registration">用户注册</MenuItem>
                    </Submenu> -->
                    
                </Menu>

            </vue-scroll>
        </div>
    </div>
</template>

<script>
export default {
  name: 'menuNav',
  data () {
    return {
        theme: 'light', // menu主题
        tab: this.$route.params.tab || this.$route.name //路由tab
    }
  },
  mounted () {
        const slef = this

        this.getDocHeight();
        window.onresize = () => {
        slef.getDocHeight();
        }
  },
  computed: {
      openName(){
            let name = this.tab
            // 应用升级  
            if(name == 'appUpgrade' || name == 'configGroupMg' || name=='parameterSet'){
                return '1'
            }
            // 网络转换
            if(
                name == 'IPv6网络转换' || 
                name == 'NAT64' || 
                name == 'NAT66' || 
                name == '组播'
            ){
                return '2'
            }
            // 集群管理
            if(name == 'clusterMg' || name == 'deviceMg'){
                return '3'
            }
            // 监控告警
            if(
                name == 'eviceStatistics' || 
                name == 'deviceMonitor'|| 
                name == 'alarmList' || 
                name == 'alarmSet'
            ){
                return '4'
            }
            // 溯源审计
            if(name == 'logStatistics'){
                return '5'
            }
            // QOS配置
            if(name == 'limitingUserBroadband' || name == 'limitingWebsiteBroadband' || name == 'restrictWebsiteVisits'){
                return '6'
            }
            // 网络安全
            if(name == 'networkSecurity' || name == 'applicationFirewall'){
                return '7'
            }
      }
  },
  watch:{
    $route(to,from){
        if(this.$route.params.tab){
            this.tab = this.$route.params.tab
        }else{
            this.tab = this.$route.name
        }
    }
  },
  methods: {
      // 获取浏览器文档高度
    getDocHeight(){
      this.docHeight = document.documentElement.clientHeight;
    //   console.log(this.docHeight);
    }
  }
}
</script>

<style scoped>
a:link, a:visited, a:hover, a:active{
    color: #515a6e;
}
</style>