<template>
    <header class="clearfix">
        <div class="header-main">
            <div class="header-left fl clearfix">
                <img class="fl" src="../assets/images/login.png" alt="logo">
                <p class="title fl">
                    <span class="line"></span>
                    DDI配置管理平台
                </p>
            </div>
            <div class="header-nav clearfix" :class="path">
                 <!-- <router-link class="nav-list fl" to="/space6Layout/space6">IPv6升级</router-link>
                <router-link class="nav-list fl" to="/dns">域名解析</router-link>
                 <router-link class="nav-list fl" to="/dhcp">地址管理</router-link>
                <router-link class="nav-list fl" to="/colony">集群管理</router-link>
                <router-link class="nav-list fl" to="/sys">系统管理</router-link>  -->
            </div>
            <div class="header-right clearfix">
                <div class="user-pic fl">
                    <Avatar :src="require('../assets/images/icon-people.png')" />
                </div>
                <div class="nva fl">
                    <Dropdown style="margin-left: 20px" @on-click="dropdownMenu">
                        <a href="javascript:void(0)">
                            Admin
                            <!-- <Icon type="md-arrow-dropdown"/></Icon> -->
                        </a>
                        <dropdownMenu slot="list">
                            <dropdownItem name="user">用户信息</dropdownItem>
                            <dropdownItem name="password">修改密码</dropdownItem>
                            <dropdownItem name="out">退出系统</dropdownItem>
                        </dropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </div>
        <div class="header-bottom">
          <Breadcrumb>
            <BreadcrumbItem :key="item.path" :to="item.path" v-for="item in BreadcrumbItem">{{item.oneTitle+'/'+item.title}}</BreadcrumbItem>
           <!-- <BreadcrumbItem to="/components/breadcrumb">Components</BreadcrumbItem>
            <BreadcrumbItem>Breadcrumb</BreadcrumbItem>-->
          </Breadcrumb>
       
        </div>
    </header>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      path: this.$route.meta.range,
      BreadcrumbItem: []
    }
  },
  watch:{
    '$route'(to,from){
        this.path = to.meta.range
        this.eve_breadcrumbItem_change()
    }
  },
  mounted() {
      this.eve_breadcrumbItem_change()
  },
  methods: {
    // 菜单跳转
    dropdownMenu(name){
        let path = '/login';
        this.$router.push({
            path
        })
    },
    eve_breadcrumbItem_change(){
        var list = this.$route.fullPath.split('/')//list[0]:是空格
        this.BreadcrumbItem = []
        function fn(obj, arr, index,self) {
            if (obj.hasOwnProperty('children')&&obj['children'].length>0) {
                for (let one of obj.children) {
                    if (one.meta.title != 'Home' && one.name == arr[index]) {
                        self.BreadcrumbItem.push({'oneTitle':one.meta.oneTitle,'title': one.meta.title, 'path': list.slice(0,index+1).join('/')})
                        return one.hasOwnProperty('children')&&one['children'].length>0?fn(one,arr,index+1,self):false

                    }
                }
            }
        }
        for(let one of this.$router.options.routes){
          if(one.hasOwnProperty('name')&& one.name != 'Login' && one.redirect.indexOf(list[1])){
            for (let arr of one.children) {
              if (arr.name == list[1]) {
                this.BreadcrumbItem.push({'title': arr.name, 'path': arr.redirect})
                
                fn(arr,list,2,this)
              }
            }
          }
        }
    },


  },

}
</script>

<style scoped>
.header-bottom{
  padding:0 15px;
  height:30px;
  line-height:30px;
  white-space: nowrap;
}
.ivu-breadcrumb{
    display:inline-block;
    font-size:14px;
    line-height:50px;
}
.ivu-breadcrumb>span:last-child{
    color:#97a8be;
    cursor:test;
}
.ivu-breadcrumb[data-v-5330e53c]{
    line-height:30px;
    font-size:18px;
}


</style>
