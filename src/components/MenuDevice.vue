<template>
    <div class="menu fl">
        <!-- <p class="title">菜单栏</p> -->
        <div class="menu-list">
            <!-- <vue-scroll :style="{height:docHeight-272+'px'}">
                
            </vue-scroll> -->
            <Menu :theme="theme" :active-name="tab" :open-names="[openName]" :accordion="true">
                <MenuItem name="deviceMg" to="/deviceLayout/deviceMg">
                    <Icon type="md-cog" />
                    设备管理
                </MenuItem>

                <!-- <Submenu name='1'>
                    <template slot="title">
                        <Icon type="md-menu"></Icon>vlan配置
                    </template>
                    <MenuItem name="subnetList" to="/dhcpLayout/subnetList">子网列表</MenuItem>
                    <MenuItem name="addressPool" to="/dhcpLayout/addressPool">地址池列表</MenuItem>
                    <MenuItem name="staticBinding" to="/dhcpLayout/staticBinding">静态绑定</MenuItem>
                </Submenu> -->
            </Menu>
            
        </div>
    </div>
</template>

<script>
export default {
  name: 'menuNavDhcp',
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
            // 设备管理
            if(name == 'deviceMg' || name== 'serviceMg'){
                return '1'
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