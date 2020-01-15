<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">区域转发</span>
        </div>
        <div class="tab-select pding select2">
            <div class="table-box">
                <div class="table-s">
                    <table class="table-default">
                        <thead>
                        <tr>
                            <th width="170">服务器地址列表</th>
                            <th width="250">转发方式</th>
                            <th width="250">操作</th>
                        </tr>
                        </thead>
                        
                        <tbody>
                            <tr>
                                <td v-if="this.ips==null"><p>-</p></td>
                                <td v-else><p v-for="value in this.ips" :key="value" >{{value}}</p></td>
                                <td>{{this.id1 == 0 ?'-':type}}</td>
                                 <td>
                                <i-button class="k-btn" @click="goConfig(id,self)">修改</i-button>
                                <i-button class="k-btn" @click="delect()">删除</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <alarm-list-config ref="alarmRef"></alarm-list-config >
        </div>
    </div>
</template>

<script>
import axios from "axios"
import AlarmListConfig from '../components/AlarmListConfig';

export default {
    name: 'dsliteBusinessAnalysis',
    data () {
        return {
        list:[],
        id:'',
        name:'',
        remove:'',
        modal1: false,
        priority:'',
        acls:[],
        resList:[],
        ips:[],
        type:'',
        self:'',
        id1:''
        }
    },
    created() {
    this.id = this.$route.query.id;
    this.self=this.$route.query.self;
    },
   components: {
     AlarmListConfig
    },
    mounted () {
        this.getView();   
    },
    methods: {  
    goConfig(id1,self){
        this.$refs.alarmRef.openModel(id1,self);  
    },
     getView(){
        this.$axios.post('http://10.0.0.19:8081'+this.self+'/'+this.id+'?'+'action=forward', {
             "oper":"GET"
          })
          .then(res=> {
              this.type=res.data.type;
              this.id1=res.data.id;
              this.ips=res.data.ips;
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
            this.$axios.post('http://10.0.0.19:8081'+this.self+'/'+this.id+'?'+'action=forward',{
                "oper":"DEL"
           })
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