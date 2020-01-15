<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">区域查询</span>
             <div class="button-box fr">
                <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig(id2)">新建</i-button>
            </div>
        </div>
        <div class="tab-select pding select2">
            <div class="table-box">
                <div class="table-s">
                    <table class="table-default">
                        <thead>
                        <tr>
                            <th width="170">区名称</th>
                            <th width="250">资源记录数量</th>
                            <th width="250">是否启用</th>
                            <th width="250">操作</th>
                        </tr>
                        </thead>
                        
                        <tbody>
                            <tr v-for="item in this.arealist" :key="item.id">
                                <td><router-link :to="{name:'appUpgrade',query:{id:item.id,self}}">{{item.name}}</router-link></td>
                                <td>{{number}}</td>
                                <td>{{item.isused === 0?'否':'是'}}</td>
                                <td>
                                <!-- <i-button class="k-btn" @click="goConfig1(item.id)">修改</i-button> -->
                                <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator placement="top"/>
            </div>
            <area-app-config ref="areaRef"></area-app-config>
            <evice-statistics-config ref="eviceRef"></evice-statistics-config>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import AreaAppConfig from '../components/AreaAppConfig';
import EviceStatisticsConfig from '../components/EviceStatisticsConfig';
export default {
    name: 'appUpgradeBusinessAnalysis',
    data () {
        return {
        id1:'',
        name:'',
        remove:'',
        modal1: false,
        arealist:[],
        file:"",
        self:"",
        number:'',
        list:[],
        isused:'',
        data1:"",
        obj:'',
        id2:'',
        }
    },
    created() {
    this.id = this.$route.query.id;
    this.id2=this.id;
    },
    mounted () {
      this.getArea();   
    },
    methods: {
     getArea(){
        this.$axios.get('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/views/'+this.id+"/zones", {
          })
          .then(res =>{
              this.data1=res.data;
              this.arealist=res.data.data
              this.self=res.data.links.self
              for(var key in this.arealist){
             this.id1=this.arealist[key].id
             this.name=this.arealist[key].name
             this.isused=this.arealist[key].isused
            }
            return this.$axios.get('http://10.0.0.19:8081'+this.self+'/'+this.id1+'/rrs', {
          })
          .then(res => {
            this.list=res.data.data
            this.number=this.list.length
           })
           })
         .catch(err =>{
            console.log(err)
         })
        },
     //新建
    goConfig(id2){
        this.$refs.areaRef.openConfig(id2);
    },
    // 修改
    goConfig1(data){
        this.$refs.eviceRef.openConfig({data});
    },
    // 删除
    delect(data){
    this.$Modal.confirm({title: '提示',content: '确定删除？',
    onOk: () => {
        this.$axios.delete('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/views/'+this.id+"/zones/ "+data,{
        })
        .then(res=>{
            this.$Message.success('删除成功');
            this.getArea();                   
        }).catch(err=>{
            this.$Message.success('删除失败');
        
        })
        }
        })
    },

    },
    components: {
     AreaAppConfig,
     EviceStatisticsConfig
    },

    
}
</script>

<style scoped>
.table-box table a{
   text-decoration: none;
}
</style>
