<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">告警列表</span>
            <div class="button-box fr"></div>
        </div>
        <div class="table-box">
            <div class="table-s">
                <vue-scroll :style="{height:tableHeight+'px'}">
                    <table class="table-default" ref="ele" style="min-width:1495px;">
                        <thead>
                            <tr>
                                <th width="160">告警时间</th>
                                <th width="80">严重性</th>
                                <th width="160">恢复时间</th>
                                <th width="80">状态</th>
                                <th width="100">告警类别</th>
                                <th width="100">设备/集群</th>
                                <th width="95">事件问题</th>
                                <th width="120">持续时间</th>
                                <th width="115">通知方式</th>
                                <th width="115">告警确认</th>
                                <th width="145">处理人</th>
                                <th width="200">备注</th>
                                <th width="120">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2019/1/1  13:01:02</td>
                                <td>严重</td>
                                <td>2019/1/1  14:01:02</td>
                                <td>
                                    <span class="state err">未解决</span>
                                </td>
                                <td>系统资源</td>
                                <td>6ate_1</td>
                                <td>CPU、内存、网卡、磁盘</td>
                                <td>1h 58m 58s</td>
                                <td>微信/邮件</td>
                                <td>
                                    <span class="state err">否</span>
                                </td>
                                <td>由系统自动记录</td>
                                <td>备注</td>
                                <td>
                                    <i-button class="k-btn" @click="goConfig()">告警确认</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </vue-scroll>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
        <alarm-list-config ref="configRef"></alarm-list-config>
    </div>
</template>

<script>
import alarmListConfig from '@/components/AlarmListConfig';
export default {
    name: 'alarmList',
    data () {
        return {
        
        }
    },
    methods: {
        goConfig(type){
            this.$refs.configRef.openModel();
        }
    },
    components: {
        alarmListConfig
    }
}
</script>

<style scoped>

</style>
