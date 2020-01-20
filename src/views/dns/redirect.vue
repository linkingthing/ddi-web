<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">查询重定向</span>
             <div class="button-box fr">
                <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig(id)">新建</i-button>
            </div>
        </div>
        <div class="tab-select pding select2">
            <div class="table-box">
                <div class="table-s">
                    <table class="table-default">
                        <thead>
                        <tr>
                            <th width="170">域名</th>
                            <th width="250">TTL</th>
                            <th width="250">记录类型</th>
                            <th width="250">记录值</th>
                            <th width="250">重定向方式</th>
                            <th width="250">操作</th>
                        </tr>
                        </thead>
                        
                        <tbody>
                            <tr v-for="item in this.list" :key="item.id">
                                <td>{{item.name}}</td>
                                <td>{{item.ttl+'s'}}</td>
                                <td>{{item.datatype}}</td>
                                <td>{{item.value}}</td>
                                <td v-if="item.redirecttype=='rpc'">直接重定向</td>
                                <td v-else-if="item.redirecttype=='redirect'">NXDOMAIN重定向</td>
                                 <td>
                                <i-button class="k-btn" @click="goConfig1(id,item.id)">修改</i-button>
                                <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <ip-library-config ref="ipRef"></ip-library-config>
            <LinkConfig ref="linkRef"></LinkConfig>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import IpLibraryConfig from '@/components/IpLibraryConfig';
import LinkConfig from '@/components/LinkConfig';

export default {
    name: 'redirect',
    data () {
        return {
        list:[],
        id:'',
        name:'',
        remove:'',
        modal1: false,
        priority:'',
        acls:[],

        }
    },
   components: {
     IpLibraryConfig,
      LinkConfig
    },
    created() {
    this.id = this.$route.query.id;
    },
    mounted () {
     this.getView();   
    },
    methods: {
    goConfig(data){
    this.$refs.ipRef.openConfig(data);
       
    },
    goConfig1(a,b){
        this.$refs.linkRef.openConfig(a,b); 
    },
     getView(){
        let _self = this;
        this.$axios.get('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/views/'+this.id+'/redirections', {
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
            this.$axios.delete('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/views/'+this.id+'/redirections/'+data,{
        } )
        .then(res=>{
            this.$Message.success('删除成功');
            this.getView();
        }).catch(err=>{this.id+
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