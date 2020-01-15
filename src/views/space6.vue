<template>
<div class="index-main" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
       <span class="tit">节点管理</span>
    </div>
    <div class="middle">
      <Row>
        <i-col span="6"><Tree :data="baseData" show-checkbox multiple ref="tree" class="tree"></Tree></i-col>
        <i-col span="17">
            <div class=top style="text-align:center">
                <p class="title_1" >QPS(如果有)</p>
                <input type="number"><span>个/秒</span>
            </div>
            <Row>
                <i-col span="8">
                    <div class="echart011 fl" id="echart011">
                        <div id="echart011_cv"></div>
                    </div>
                </i-col>
                <i-col span="8">
                      <div class="echart011 fl" id="echart011">
                        <div id="echart011_cv"></div>
                    </div>
                </i-col>
                <i-col span="8">
                      <div class="echart011 fl" id="echart011">
                        <div id="echart011_cv"></div>
                    </div>
                </i-col>
            </Row>
        </i-col>
      </Row>
    </div>
  <analysis3 ref="analysis3Ref"></analysis3>
</div>
</template>

<script>
import echarts from 'echarts';
import analysis3 from '../components/Analysis3'

import {
    option1Fn, 
    option011Fn,
    option2Fn, 
    option5Fn, 
    option7Fn,
    option8Fn,
    option92Fn,
    optionLLFn
} from '../assets/js/mEcharts';


export default {
  name: 'indexMain',
  data () {
    return {
    baseData: [{
    expand: true,
    title: '节点管理',
    children: [{
        title: '控制主机',
        expand: true,
        disabled: false,
        children: [{
            title: 'host1',
            disableCheckbox: false
        }, {
            title: 'host2',
        }]
    }, 
    {
        title: '数据库',
        expand: true,
        checked: true,
        children: [{
            title: '数据库1',
            disableCheckbox: false
        },{
            title: '数据库2',
            disableCheckbox: false  
        }
        ]
    },
    {
        title: '消息队列',
        expand: true,
        checked: true,
        children: [{
            title: '消息队列1',
            disableCheckbox: false
        },{
            title: '消息队列2',
            disableCheckbox: false  
        }
        ]
    },
    ]
}]
    }
  },
  mounted () {
    // 业务数量和状态
    let option1 = option1Fn();
    var echart01 = echarts.init(document.getElementById('echart01_cv'));
    echart01.setOption(option1);

     // 业务数量和状态
    let option011 = option011Fn();
    var echart011 = echarts.init(document.getElementById('echart011_cv'));
    echart011.setOption(option011);

    // 访问量和流量统计
    // this.loadEchart02();
     // 访问量和流量统计
    this.loadEchart02s();
    // 顶部流量图
    this.loadEchart_LL();

    // 集群01
    let option5 = option5Fn();
    var echart05 = echarts.init(document.getElementById('echart05'));
    echart05.setOption(option5);

    // 集群02
    var echart06 = echarts.init(document.getElementById('echart06'));
    echart06.setOption(option5);

    // 告警总数
    let option7 = option7Fn();
    var echart07 = echarts.init(document.getElementById('echart07'));
    echart07.setOption(option7);

    // 告警总数
    let option8 = option8Fn();
    var option08 = echarts.init(document.getElementById('echart08'));
    option08.setOption(option8);
  },
  methods: {
        // 访问量&流量统计 触发集群选择
        onChangeColony(value){
            alert(value);
        },

        // 访问量和流量统计图表
        loadEchart02s(val,type){
            let option2 = option92Fn(val,type);
            var echart02_1s = echarts.init(document.getElementById('echart02s'));
            echart02_1s.setOption(option2);
            window.addEventListener("resize",function(){
                echart02_1s.resize();
            });
        },
        loadEchart_LL(val){
            

            let optionLL = optionLLFn(val,()=>{
                this.goAnalysis3()
            });
            var concurrency_charts = echarts.init(document.getElementById('concurrency_charts'));
            concurrency_charts.setOption(optionLL);
            window.addEventListener("resize",function(){
                concurrency_charts.resize();
            });
        },
        goAnalysis3(title){
            this.$refs.analysis3Ref.openModel({
                title,
                time: this.time2
            })
        }
  },
  components:{
    analysis3
  },
  watch: {
      time(val){
        this.loadEchart02s(val, this.type);
      },
      time2(val){
        this.loadEchart_LL(val);
      },
      type(val){
        this.loadEchart02s(this.time, val);
      }
  }
}
</script>

<style scoped lang="less">
.index-main {
    padding: 0px;
    background-color: white;
    border-radius: 6px;
}
.index-main .header-title {
    border-bottom: 0px solid #D7D7D7; 
    height: 72px;
}
.ivu-col-span-6{
     height:100%;
     margin-left:60px;
}
.title_1{
  margin-left:-8%;
}


</style>