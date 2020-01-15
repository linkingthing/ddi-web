<template>
    <modal
        v-model="analysis3Modal"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        :footer-hide="true"
        width="961">
        <div slot="header">{{data.title}}</div>
        <div class="pop-content">
            <div class="pop-box">
                <!-- <p class="title">{{analysisData.title}}</p> -->
                <div class="concurrency">
                    <div class="concurrency-t">
                        <div class="condition tc" style="margin-bottom: 5px">
                        <ul class="time clearfix">
                                <li class="fl" :class="{active:time2=='最近24小时'}" @click="time2='最近24小时'">最近24小时</li>
                                <li class="fl" :class="{active:time2=='最近一周'}" @click="time2='最近一周'">最近一周</li>
                                <li class="fl" :class="{active:time2=='最近一月'}" @click="time2='最近一月'">最近一月</li>
                            </ul>
                        </div>
                    </div>
                    <div class="concurrency_charts" id="concurrency_charts2"></div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import echarts from 'echarts';
import {optionLLFn3 } from '../assets/js/mEcharts';

export default {
    name: 'Analysis3',
    data () {
        return {
            analysis3Modal: false,
            time2: '最近24小时',
            data: {}
        }
    },
    mounted () {
        this.loadEchart_LL();
 
    },
    methods: {
        openModel(data){
            this.analysis3Modal = true;
            this.data.title = data.title;
            this.time2 = data.time
        },
        loadEchart_LL(val){
            setTimeout(()=>{
                let optionLL = optionLLFn3(val);
                var concurrency_charts2 = echarts.init(document.getElementById('concurrency_charts2'));
                concurrency_charts2.setOption(optionLL);
            },0)
            
        }
    },
    watch: {
        time2(val){
            this.loadEchart_LL(val);
        }
    }
}
</script>

<style scoped>
    #concurrency_charts2{
        width: 901px;
        height: 365px;
    }
    .time{
        margin-top: 0;
    }
</style>