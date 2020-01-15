<template>
    <div class="menu fl">
        <!-- <p class="title">菜单栏</p> -->
        <div class="menu-list">
            <vue-scroll :style="{minHeight:docHeight-200+'px'}">
                <Menu :theme="theme" :active-name="tab" :open-names="[openName]" :accordion="true">
                    <Submenu name='1'>
                        <template slot="title">
                            <Icon type="md-menu"></Icon>权威管理
                        </template>
                        <MenuItem name="forwardDomain" to="/dnsLayout/forwardDomain">正向域名解析</MenuItem>
                        <MenuItem name="reverseIp" to="/dnsLayout/reverseIp">反向域名解析</MenuItem>
                    </Submenu>
                    <Submenu name='2'>
                        <template slot="title">
                            <Icon type="md-menu"></Icon>递归管理
                        </template>
                        <MenuItem name="recursionAnalysis" to="/dnsLayout/recursionAnalysis">递归解析</MenuItem>
                        <MenuItem name="forwardConfig" to="/dnsLayout/forwardConfig">转发配置</MenuItem>
                    </Submenu>
                    <Submenu name='4'>
                        <template slot="title">
                            <Icon type="md-menu"></Icon>智能链路
                        </template>
                        <MenuItem name="linkConfig" to="/dnsLayout/linkConfig">链路类型配置</MenuItem>
                        <MenuItem name="linkPort" to="/dnsLayout/linkPort">链路端口配置</MenuItem>
                        <MenuItem name="ipLibrary" to="/dnsLayout/ipLibrary">IP库配置</MenuItem>
                    </Submenu>
                    <Submenu name='5'>
                        <template slot="title">
                            <Icon type="md-menu"></Icon>访问控制
                        </template>
                        <MenuItem name="blacklist" to="/dnsLayout/blacklist">黑名单配置</MenuItem>
                    </Submenu>
                    <Submenu name='3'>
                        <template slot="title">
                            <Icon type="md-menu"></Icon>服务管理
                        </template>
                        <MenuItem name="sysConfig" to="/dnsLayout/sysConfig">服务配置</MenuItem>
                        <MenuItem name="sysMonitor" to="/dnsLayout/sysMonitor">服务监控</MenuItem>
                    </Submenu>
                </Menu>
            </vue-scroll>
            
        </div>
    </div>
</template>

<script>
export default {
  name: 'menuNavDns',
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
            // 权威设置
            if(name == 'forwardDomain' || name == 'analyticalSetup' || name=='reverseIp'){
                return '1'
            }
            // 递归管理
            if(name == 'recursionAnalysis' || name == 'forwardConfig'){
                return '2'
            }
            // 系统管理
            if(name == 'sysConfig' || name == 'sysMonitor'){
                return '3'
            }
            // 智能链路
            if(name == 'linkConfig' || name=='linkPort' || name == 'ipLibrary'){
                return '4'
            }
            // 访问控制
            if(name == 'blacklist'){
                return '5'
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
      console.log(this.docHeight);
    }
  }
}
</script>

<style scoped>
a:link, a:visited, a:hover, a:active{
    color: #515a6e;
}
</style>