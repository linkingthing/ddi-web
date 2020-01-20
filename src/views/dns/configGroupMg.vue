<template>
    <div class="index-main columns t-box right-content">
        <div class="header-title">
            <span class="tit">配置管理</span>
        </div>
        <div class="tab-select pding select2">
            <div class="table-box">
                <div class="table-s">
                 
                    <table class="table-default">
                        <thead>
                        <tr>
                            <th width="170">视图名称</th>
                            <th width="250">区数量</th>
                            <th width="250">优先级</th>
                            <th width="250">访问控制列表</th>
                            <!-- name:'appUpgradeBusinessAnalysis' -->
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in this.list" :key="item.id">
                                <td><router-link :to="{name:'appUpgradeBusinessAnalysis',query:{id:item.id}}">{{item.name}}</router-link></td>
                                <td>{{item.zonesize}}</td>
                                <td>{{item.priority}}</td>
                                <td><p v-for="value in item.acls" :key="value.id">{{value.name}}</p></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
export default {
    name: 'configGroupMg',
    data () {
        return {
        list:[],
        IP:[],
        id:'',
        name:'',
        remove:'',
        modal1: false,
        aclids:[],
        zones:"",
        areaList:[],
        number:''

        }
    },
    mounted () {
        this.getConfig();   
    },
    methods: {
    getConfig(){
        this.$axios.get('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/views', {
          })
          .then(res => {
              this.list = res.data.data;
              for(var key in this.list){
             this.id = this.list[key].id
             this.name = this.list[key].name
             this.priority = this.list[key].priority
             this.aclids = this.list[key].aclids
             this.zones = this.list[key].links.zones
             this.zonesize=this.list[key].links.zonesize
            }
           })     
         .catch(function (err) {
            console.log(err)
         })
        
        },

    },

    
}
</script>

<style scoped>
.table-box table a{
   text-decoration: none;
}
.right-content {
    height: 100%;
}
</style>
