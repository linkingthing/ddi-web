<template>
    <div class="menu fl">
        <!-- <p class="title">菜单栏</p> -->
        <div class="menu-list">
            <vue-scroll :style="{minHeight:docHeight-200+'px'}">
                 <Menu :theme="theme" :active-name="tab" :open-names="[openName]" :accordion="true">
                    <MenuItem name="subnetList" to="/dhcpLayout/subnetList">
                        <Icon type="md-cog" />
                        子网列表
                    </MenuItem>
                    <!-- <MenuItem name="addressPool" to="/dhcpLayout/addressPool">
                        <Icon type="md-cog" />
                        地址池配置
                    </MenuItem> -->
                    <MenuItem name="staticBinding" to="/dhcpLayout/staticBinding">
                        <Icon type="md-cog" />
                        静态绑定
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
            </vue-scroll>
           
            
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
            // vlan配置
            if(name == 'subnetList' || name == 'addressPool' || name == 'staticBinding'){
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