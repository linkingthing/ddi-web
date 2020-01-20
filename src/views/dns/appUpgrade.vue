<template>
    <div class="index-main appUpgrade t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">资源记录</span>
            <div class="button-box fr">
                <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig(self,id)">新建</i-button>
            </div>
        </div>
        <div class="table-box">
            <div class="table-s">
                <vue-scroll :style="{minHeight:tableHeight+'px'}">
                    <table class="table-default" ref="ele">
                        <thead>
                            <tr>
                                <th width="140">名称</th>
                                <th width="140">类型</th>
                                <th width="160">记录值</th>
                                <th width="95">TTL</th>
                                <th width="230">是否启用</th>
                                <th width="240">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in this.resList" :key="item.id">
                                <td>{{item.name}}</td>
                                <td>{{item.type}}</td>
                                <td>{{item.value}}</td>  
                                <td>{{item.ttl+'s'}}</td> 
                                <td>{{item.isused === 0?'否':'是'}}</td>
                                <td>
                                  <i-button class="k-btn" @click="goAnalysis(self,id,item.id)">修改</i-button>
                                  <i-button class="k-btn" @click="delect(item.id)">删除</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </vue-scroll>
                
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
        <website-up-config ref="configRef"></website-up-config>
        <analysis ref="analysisRef"></analysis>
    </div>
</template>

<script>
import axios from "axios"
import WebsiteUpConfig from '@/components/WebsiteUpConfig';
import Analysis from '@/components/Analysis';

export default {
    name: 'appUpgrade',
    data () {
        return {
          id:'',
          self:" ",
          resList:[],  
        }
    },
    created() {
    this.id = this.$route.query.id;
    this.self=this.$route.query.self;
    },
    mounted () {
    this.getResources();
    },
    methods: {
    goConfig(self,id){
      this.$refs.configRef.openConfig(self,id); 
    },
    goAnalysis(self,id,data){
            this.$refs.analysisRef.openModel(self,id,data)
        },
    getResources(){
        this.$axios.get('http://10.0.0.19:8081'+this.self+'/'+this.id+'/rrs', {
          })
          .then(res => {
            this.resList=res.data.data;
           })
         .catch(err => {
            console.log(err)
         })
        },
        // 删除
        delect(data){
            this.$Modal.confirm({
                title: '提示',
                content: '确定删除？',
               onOk: () => {
            this.$axios.delete('http://10.0.0.19:8081'+this.self+'/'+this.id+'/rrs/'+data,{
        } )
        .then(res=>{
            this.$Message.success('删除成功');
            this.getResources();
        }).catch(err=>{
            this.$Message.success('删除失败');
        
        })
        }
        })
        }
    },
    components: {
        WebsiteUpConfig,
        Analysis,
        // Analysis2
    }
}
</script>

<style scoped>

</style>
