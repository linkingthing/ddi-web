<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">视图管理</span>
             <div class="button-box fr">
                <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig(0)">新建</i-button>
            </div>
        </div>
        <div class="tab-select pding select2">
            <div class="table-box">
                <div class="table-s">
                    <table class="table-default">
                        <thead>
                        <tr>
                            <th width="170">名称</th>
                            <th width="250">访问控制列表</th>
                            <th width="250">优先级</th>
                            <th width="250">是否启用</th>
                            <th width="250">操作</th>
                        </tr>
                        </thead>
                        
                        <tbody>
                            <tr v-for="item in this.list" :key="item.id">
                                <td>{{item.name}}</td>
                                <td><p v-for="value in item.acls" :key="value.id">{{value.name}}</p></td>
                                <td>{{item.priority}}</td>
                                <td >{{item.isused === 0?'否':'是'}}</td>
                                 <td>
                                <i-button class="k-btn" @click="goConfig1(item.id,item.name)">修改</i-button>
                                <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <device-monitor-config ref="deviceRef"></device-monitor-config>
            <analysis2 ref="analysis2Ref"></analysis2>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import DeviceMonitorConfig from '../components/DeviceMonitorConfig';
import Analysis2 from '../components/Analysis2';

export default {
    name: 'deviceMonitor',
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
     DeviceMonitorConfig,
      Analysis2
    },
    mounted () {
        this.getView();   
    },
    methods: {
    goConfig(type){
        if(type == 0){
        this.$refs.deviceRef.openConfig();
        }
    },
    goConfig1(a,b){
        this.$refs.analysis2Ref.openConfig(a,b);  
    },
     getView(){
        let _self = this;
        this.$axios.get('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/views', {
          })
          .then(function (res) {
              _self.list=res.data.data;
              for(var key in _self.list){
             _self.id=_self.list[key].id
             _self.name=_self.list[key].name
             _self.priority=_self.list[key].priority
             _self.acls=_self.list[key].acls
            }
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
            this.$axios.delete('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/views/'+data,{
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
