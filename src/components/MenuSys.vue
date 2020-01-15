<template>
    <div class="menu fl">
        <!-- <p class="title">菜单栏</p> -->
        <div class="menu-list">
            <vue-scroll :style="{minHeight:docHeight-200+'px'}">
                <Menu :theme="theme" :active-name="tab" :open-names="[openName]" :accordion="true">
                    <Submenu name='1'>
                        <template slot="title">
                            <Icon type="md-menu"></Icon>系统管理
                        </template>
                        <MenuItem name="userList" to="/sysLayout/userList">用户列表</MenuItem>
                        <MenuItem name="roleMg" to="/sysLayout/roleMg">角色管理</MenuItem>
                        <MenuItem name="sysLog" to="/sysLayout/sysLog">系统日志</MenuItem>
                    </Submenu>
                </Menu>
            </vue-scroll>
            
            
        </div>
    </div>
</template>

<script>
export default {
  name: 'menuNavSys',
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
            // 系统管理
            if(name == 'userList' || name == 'roleMg' || name == 'sysLog'){
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