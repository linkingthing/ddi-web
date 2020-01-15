<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">A4地址合成查询表</span>
             <div class="button-box fr">
                <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig(dns64s)">新建</i-button>
            </div>
        </div>
        <div class="tab-select pding select2">
            <div class="table-box">
                <div class="table-s">
                    <table class="table-default">
                        <thead>
                        <tr>
                            <th width="170">前缀</th>
                            <th width="250">客户IP白名单</th>
                            <th width="250">客户IP白名单</th>
                             <th width="250">目标IPv4地址</th>
                            <th width="250">操作</th>
                        </tr>
                        </thead>
                        
                        <tbody>
                            <tr v-for="item in this.list" :key="item.id">
                                <td>{{item.prefix}}</td>
                                <td>{{item.whitename}}</td>
                                <td >{{item.blackname}}</td>
                                <td >{{item.addressname}}</td>
                                 <td>
                                <i-button class="k-btn" @click="goConfig1(dns64s,item.id)">修改</i-button>
                                <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <RestrictWebsiteVisitsConfig ref="resRef"></RestrictWebsiteVisitsConfig>
            <power-config ref="powerRef"></power-config>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import RestrictWebsiteVisitsConfig from '../components/RestrictWebsiteVisitsConfig';
import PowerConfig from '../components/PowerConfig';

export default {
    name: 'limitingWebsiteBroadband',
    data () {
        return {
        list:[],
        id:'',
        name:'',
        remove:'',
        modal1: false,
        priority:'',
        acls:[],
        dns64s:'',
        id1:'',

        }
    },
    created(id,dns64s) {
    this.id = this.$route.query.id;
    this.dns64s=this.$route.query.dns64s;
    },
   components: {
     RestrictWebsiteVisitsConfig,
     PowerConfig
    },
    mounted () {
        this.getView();   
    },
    methods: {
    goConfig(dns64s){
        this.$refs.resRef.openConfig(dns64s);
    },
    goConfig1(dns64s,b){
        this.$refs.powerRef.openConfig(dns64s,b);  
    },
     getView(){
        let _self = this;
        this.$axios.get('http://10.0.0.19:8081'+this.dns64s, {
          })
          .then(function (res) {
              _self.list=res.data.data;
           })
         .catch(function (err) {
            console.log(err)
         })
        },

          // 删除
        delect(data){
            this.$Modal.confirm({
                title: '提示',
                content: '确定删除？',
               onOk: () => {
            this.$axios.delete('http://10.0.0.19:8081'+this.dns64s+'/'+data,{
        } )
        .then(res=>{
            this.$Message.success('删除成功');
            this.getView();
        }).catch(err=>{
            this.$Message.success('删除失败');
        
        })
        }
        })
        }

 },

    
}
</script>

<style scoped>

</style>

