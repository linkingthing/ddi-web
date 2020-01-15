<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">服务管理</span>
            <div class="button-box fr"></div>
        </div>
        <div class="index-03 table-box">
            <p class="title">服务监控
                <!-- <a href="" class="more">更多>></a> -->
            </p>
            <div class="index-03-c page-form">
                <div class="condition">
                    <ul class="time clearfix" style="margin-top: 0;">
                        <li class="fl" :class="{active:time=='最近24小时'}" @click="time='最近24小时'">最近24小时</li>
                            <li class="fl" :class="{active:time=='最近一周'}" @click="time='最近一周'">最近一周</li>
                            <li class="fl" :class="{active:time=='最近一月'}" @click="time='最近一月'">最近一月</li>
                    </ul>
                </div>
                <div id="echart02"></div>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
import {
    option11Fn
} from '../assets/js/mEcharts';
export default {
    name: 'sysMonitor',
    data () {
        return {
            time: '最近24小时',
            dataConfig: {
                t1: ''
            }
        }
    },
    mounted () {
        this.loadEchart02();
    },
    methods: {
        loadEchart02(val){
            let option = option11Fn(val);
            var echart = echarts.init(document.getElementById('echart02'));
            echart.setOption(option);
            window.addEventListener("resize",function(){
                echart.resize();
            });
        }
    },
    watch: {
        time(val){
            this.loadEchart02(val);
        }
    }
}
</script>

<style scoped>
    .index-03{
        padding: 20px 30px;
        margin-top: 0;
    }
</style>
