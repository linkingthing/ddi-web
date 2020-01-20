<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">A4地址合成</span>
        </div>
        <div class="tab-select pding select2">
            <div class="table-box">
                <div class="table-s">
                    <table class="table-default">
                        <thead>
                        <tr>
                            <th width="170">视图</th>
                            <th width="250">规则数量</th>
                        </tr>
                        </thead>
                        
                        <tbody>
                            <tr v-for="item in this.list" :key="item.id">
                                <td><router-link :to="{name:'restrictWebsiteVisits',query:{id:item.id,dns64s:item.links.dns64s}}">{{item.name}}</router-link></td>
                                <td>{{item.dns64size}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <NetworkSwitch ref="networkRef"></NetworkSwitch>
            <subnet-list-config ref="subnetRef"></subnet-list-config>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import NetworkSwitch from '@/components/NetworkSwitch';
import SubnetListConfig from '@/components/SubnetListConfig';

export default {
    name: 'limitingUserBroadband',
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

        }
    },
   components: {
     NetworkSwitch,
     SubnetListConfig
    },
    mounted () {
        this.getView();   
    },
    methods: {
     getView(){
        this.$axios.get('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/views', {
          })
          .then(res=> {
              this.list=res.data.data;
            for(var key in this.list){
             this.dns64s = this.list[key].links.dns64s
            }
           })
         .catch(err=> {
            console.log(err)
         })
        },

          // 删除
        delect(data){
            this.$Modal.confirm({
                title: '提示',
                content: '确定删除？',
               onOk: () => {
            this.$axios.delete('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/defaultdns64s/'+data,{
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
.table-box table a{
   text-decoration: none;
}
</style>
