<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">访问控制表</span>
             <div class="button-box fr">
                <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig(0)">新建</i-button>
                 <!-- <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig('新增参数')">新建</i-button> -->
            </div>
        </div>
        <div class="tab-select pding select2">
            <div class="table-box">
                <div class="table-s">
                    <table class="table-default">
                        <thead>
                        <tr>
                            <th width="170">名称</th>
                            <th width="250">IP</th>
                            <th width="250">操作</th>
                        </tr>
                        </thead>
                        
                        <tbody>
                            <tr v-for="item in this.list" :key="item.id">
                                <td>{{item.name}}</td>
                                <td><p v-for="value in item.IP" :key="value.id">{{value}}</p></td>
                                <td>
                                <i-button class="k-btn" @click="goConfig1(item.id)">修改</i-button>
                                <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator placement="top"/> -->
            </div>
            <config-group-mg-config ref="configRef"></config-group-mg-config>
            <evice-statistics-config ref="eviceRef"></evice-statistics-config>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import ConfigGroupMgConfig from '../components/ConfigGroupMgConfig';
import EviceStatisticsConfig from '../components/EviceStatisticsConfig';
export default {
    name: 'eviceStatistics',
    data () {
        return {
        list:[],
        IP:[],
        id:'',
        name:'',
        remove:'',
        modal1: false

        }
    },
   components: {
     ConfigGroupMgConfig,
     EviceStatisticsConfig
    },
    mounted () {
        this.getManger();   
    },
    methods: {
     getManger(){
        let _self = this;
        this.$axios.get('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/acls', {
          })
          .then(function (res) {
              _self.list=res.data.data;
              for(var key in _self.list){
             _self.id=_self.list[key].id
             _self.name=_self.list[key].name
             _self.IP=_self.list[key].IP
            }
           })
         .catch(function (err) {
            console.log(err)
         })
        },
     //修改
    goConfig(type){
        if(type == 0){
        this.$refs.configRef.openConfig()
        }
    },
    goConfig1(data){
        this.$refs.eviceRef.openConfig({data});
    },
    // 删除
    delect(data){
    this.$Modal.confirm({title: '提示',content: '确定删除？',
    onOk: () => {
        this.$axios.delete('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/acls/'+data,{
        } )
        .then(res=>{
            this.$Message.success('删除成功');
            this.getManger();
        }).catch(err=>{
            this.$Message.success('删除失败');
        
        })
        }
        })
    },

    },

    
}
</script>

<style scoped>

</style>
