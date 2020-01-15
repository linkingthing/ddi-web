<template>
    <div class="index-main t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">区查询</span>
            <div class="button-box fr"></div>
        </div>
        <div class="table-box">
            <div class="table-s">
                <table class="table-default">
                    <thead>
                        <tr>
                            <th width="345">域名</th>
                            <th width="335">转发地址数量</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in this.dsliteList" :key="item.id">
                            <td><router-link :to="{name:'dsliteBusinessAnalysis',query:{id:item.id,self}}">{{item.name}}</router-link></td>
                            <td>{{item.forwardsize}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'dsliteAnalysis',
    data () {
        return {
         id:'',
         dsliteList:[],
         self:'',
        }
    },
created() {
  this.id = this.$route.query.id;
},
mounted () {
    this.getManger();   
},
methods: {
    getManger(){
    this.$axios.get('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/views/'+this.id+'/zones', {
        })
        .then(res => {
           this.self=res.data.links.self;
           this.dsliteList=res.data.data
        })
        .catch(err => {
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
</style>
