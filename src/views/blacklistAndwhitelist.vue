<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">地址黑名单配置</span>
            <div class="button-box fr">
                <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig()">新增</i-button>
            </div>
        </div>
        <div class="table-box">
            <div class="table-s">
                <table class="table-default" ref="ele">
                    <thead>
                        <tr>
                            <th width="220">访问控制列表</th>
                            <th width="240">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in this.acls" :key="item.id">
                            <td>{{item.name}}</td>
                            <td>
                                <i-button class="k-btn" @click="goConfig1(item.id)">修改</i-button>
                                <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <blacklist-config ref="configRef"></blacklist-config>
    </div>
</template>

<script>
import axios from "axios"
import blacklistConfig from '../components/BlacklistConfig';
export default {
    name: 'blacklistAndwhitelist',
    data () {
        return {
        listL:[],
        acls:[],
        }
    },
    mounted () {
      this.getView();   
    },
    methods: {
       goConfig(){
         this.$refs.configRef.openModel();
        },
        goConfig1(){
        this.$refs.configRef.openModel();
        },
        getView(){
        this.$axios.get('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/ipblackholes', {
          })
          .then(res=> {
           this.list=res.data.data
            for(var key in this.list){
             this.acls = this.list[key].acls
              console.log(this.acls)
              console.log(2222222);
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
    components: {
        blacklistConfig
    }
}
</script>

<style scoped>
    a{
        text-decoration:none!important;
    }
</style>
