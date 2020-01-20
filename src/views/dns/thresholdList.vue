<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">阀值列表</span>
            <div class="button-box fr"></div>
        </div>
        <div class="table-box">
            <div class="table-s">
                <table class="table-default" ref="ele">
                    <thead>
                        <tr>
                            <th width="160">告警阀值列表</th>
                            <th width="100">普通告警</th>
                            <th width="100">次要告警</th>
                            <th width="100">主要告警</th>
                            <th width="100">严重告警</th>
                            <th width="100">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>设备CPU使用率</td>
                            <td>1.0%</td>
                            <td>70%</td>
                            <td>80%</td>
                            <td>90%</td>
                            <td>
                                <i-button class="k-btn" @click="goThreshold('设备CPU使用率')">设置</i-button>
                            </td>
                        </tr>
                        <tr>
                            <td>设备物理内存占用率</td>
                            <td>1.0%</td>
                            <td>70%</td>
                            <td>80%</td>
                            <td>90%</td>
                            <td>
                                <i-button class="k-btn" @click="goThreshold('设备物理内存占用率')">设置</i-button>
                            </td>
                        </tr>
                        <tr>
                            <td>设备交换区占有率</td>
                            <td>1.0%</td>
                            <td>70%</td>
                            <td>80%</td>
                            <td>90%</td>
                            <td>
                                <i-button class="k-btn" @click="goThreshold('设备交换区占有率')">设置</i-button>
                            </td>
                        </tr>
                        <tr>
                            <td>设备CPU温度</td>
                            <td>1.0%</td>
                            <td>70%</td>
                            <td>80%</td>
                            <td>90%</td>
                            <td>
                                <i-button class="k-btn" @click="goThreshold('设备CPU温度')">设置</i-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
        <threshold-config ref="thresholdRef"></threshold-config>
    </div>
</template>

<script>
import ThresholdConfig from '@/components/ThresholdConfig';

export default {
    name: 'thresholdList',
    data () {
        return {
        
        }
    },
    methods: {
        goThreshold(type){
            this.$refs.thresholdRef.openModel({
                title: type
            });
        }
    },
    components: {
      ThresholdConfig
  }
}
</script>

<style scoped>

</style>
