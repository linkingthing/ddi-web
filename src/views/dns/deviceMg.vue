<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">设备管理</span>
            <div class="button-box fr">
                <!-- <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goAdjunction(0)">新增</i-button> -->
            </div>
        </div>
        <div class="table-box  iview-table">
            <div class="table-s">
                <Table 
                    border 
                    :columns="columns" 
                    :data="data" 
                    :disabled-hover="true">
                </Table>


                <!-- <vue-scroll :style="{height:tableHeight+'px'}">
                    <table class="table-default" ref="ele">
                        <thead>
                            <tr>
                                <th width="100">设备名称</th>
                                <th width="100">设备类型</th>
                                <th width="100">集群组</th>
                                <th width="160">IPv4管理地址</th>
                                <th width="160">IPv6管理地址</th>
                                <th width="110">物理状态</th>
                                <th width="110">服务状态</th>
                                <th width="130">统计分析</th>
                                <th width="355">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>ate1</td>
                                <td>6ATE</td>
                                <td>ate_G1</td>
                                <td>192.168.1.21</td>
                                <td>2001:A:B::21</td>
                                <td>
                                    <Tooltip placement="right">
                                        <span class="state">在线</span>
                                        <div slot="content">
                                            <p>CPU:12.8%</p>
                                            <p>内存:3/16GB</p>
                                            <p>磁盘:100/1000GB</p>
                                        </div>
                                    </Tooltip>
                                </td>
                                <td>
                                    <span class="state err">离线</span>
                                </td>
                                <td>
                                    <a href="javascript:" @click="goAnalysis('并发量')">并发量</a>
                                    <a href="javascript:" @click="goAnalysis2('网络流量')">网络流量</a>
                                </td>
                                <td>
                                    <i-button class="k-btn" :to="{ path: '/deviceLayout/serviceMg', query: { index: 0}}">服务管理</i-button>
                                    <i-button class="k-btn" @click="goAdjunction(1)">修改</i-button>
                                    <i-button class="k-btn">启用</i-button>
                                </td>
                            </tr>
                            <tr>
                                <td>ate2</td>
                                <td>6NTE</td>
                                <td>ate_G2</td>
                                <td>192.168.1.22</td>
                                <td>2001:A:B::22</td>
                                <td>
                                    <span class="state err">离线</span>
                                </td>
                                <td>
                                    <Tooltip placement="right">
                                        <span class="state">在线</span>
                                        <div slot="content">
                                            <p>应用升级:正常</p>
                                            <p>集群服务:正常</p>
                                            <p>网络转换:正常</p>
                                            <p>WAF服务:正常</p>
                                            <p>网络安全服务:正常</p>
                                            <p>QOS:<span class="state err">未安装</span></p>
                                        </div>
                                    </Tooltip>
                                </td>
                                <td>
                                    <a href="javascript:" @click="goAnalysis('并发量')">并发量</a>
                                    <a href="javascript:" @click="goAnalysis2('网络流量')">网络流量</a>
                                </td>
                                <td>
                                    <i-button class="k-btn" :to="{ path: '/deviceLayout/serviceMg', query: { index: 1}}">服务管理</i-button>
                                    <i-button class="k-btn" @click="goAdjunction(1)">修改</i-button>
                                    <i-button class="k-btn">停用</i-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </vue-scroll> -->
            </div>
            <!-- <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/> -->
        </div>
        <device-mg-adjunction ref="configRef"></device-mg-adjunction>  
        <analysis ref="analysisRef"></analysis>
        <analysis2 ref="analysis2Ref"></analysis2>
    </div>
</template>

<script>
import DeviceMgAdjunction from '@/components/DeviceMgAdjunction';
import Analysis from '@/components/Analysis';
import Analysis2 from '@/components/Analysis2';

import { fetchDeviceListApi } from '../service/index'



export default {
    name: 'deviceMg',
    data () {
        return {
            columns: [{
                title: '设备名称',
                key: 'name',
                align: 'center',
                minWidth: 118,
                filters: [],
                filterMethod: (value, row) => {
                    return value === row.name
                }
            },
            {
                title: '设备类型',
                key: 'type',
                align: 'center',
                minWidth: 118,
                render: (h, params) => {
                    if(params.row.type == 1){
                        return h('span', {}, 'ATE')
                    }else if(params.row.type == 2){
                        return h('span', {}, 'EAG')
                    }else if(params.row.type == 3){
                        return h('span', {}, 'NTE')
                    }
                },
                filters: [],
                filterMethod (value, row) {
                    return value === row.type
                }
            },
            {
                title: '集群组',
                key: 'clusterName',
                align: 'center',
                minWidth: 115,
                render: (h, params) => {
                    return h('span', {}, params.row.cluster.clusterName)
                },
                filters: [],
                filterMethod (value, row) {
                    return value === row.cluster.clusterName
                }
            },
            {
                title: 'IPv4管理地址',
                key: 'ipv4Addr',
                align: 'center',
                minWidth: 185,
                sortable: true,
                render: (h, params) => {
                    if(params.row.ipv4Addr == null){
                        return h('span', {}, '-')
                    }else{
                         return h('span', {}, params.row.ipv4Addr)
                    }
                }
            },
            {
                title: 'IPv6管理地址',
                key: 'ipv6Addr',
                align: 'center',
                minWidth: 185,
                sortable: true,
                render: (h, params) => {
                    if(params.row.ipv6Addr == null){
                        return h('span', {}, '-')
                    }else{
                        return h('span', {}, params.row.ipv6Addr)
                    }
                }
            },
            {
                title: '物理状态',
                slot: 'date6',
                align: 'center',
                minWidth: 130,
                render: (h, params) => {
                    if(params.row.date6 == 0){
                        return h('Tooltip', {
                            props: {
                                placement: "right"
                            }
                        },[
                            '在线',
                            [
                            h('p', { slot: 'content'},'CPU:12.8%'),
                            h('p', { slot: 'content'},'内存:3/16GB'),
                            h('p', { slot: 'content'},'磁盘:100/1000GB')
                            ]
                        ]);
                    }else{
                        return h('span', {
                            class: 'state err'
                        }, '离线');
                    }
                }
            },
            {
                title: '服务状态',
                slot: 'date7',
                align: 'center',
                minWidth: 130,
                render: (h, params) => {
                    if(params.row.date7 == 0){
                        return h('Tooltip', {
                            props: {
                                placement: "right"
                            }
                        },[
                            '在线',
                            [
                            h('p', { slot: 'content'},'应用升级:正常'),
                            h('p', { slot: 'content'},'集群服务:正常'),
                            h('p', { slot: 'content'},'WAF服务:正常'),
                            h('p', { slot: 'content'},'网络安全服务:正常'),
                            h('p', { slot: 'content'},['QOS:',[
                                    h('span', {
                                        class: 'state err'
                                    }, '离线')]
                                ])
                            ]
                        ]);
                    }else{
                        return h('span', {
                            class: 'state err'
                        }, '离线');
                    }
                    
                }
            },
            {
                title: '业务量',
                slot: 'date8',
                align: 'center',
                minWidth: 155,
                render: (h, params) => {
                return h('div', [
                    h('a', {
                        attrs: {
                            href: 'javascript:'
                        },
                        on: {
                            click: () => {
                                this.goAnalysis('并发量')
                            }
                        }
                    }, '并发量'),
                    h('span', {
                    }, ' '),
                    h('a', {
                        attrs: {
                            href: 'javascript:'
                        },
                        on: {
                            click: () => {
                                this.goAnalysis2('网络流量')
                            }
                        }
                    }, '网络流量')
                ]);
                }
            },
            {
                title: '操作',
                slot: 'date9',
                align: 'center',
                minWidth: 410,
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            class: 'k-btn',
                            on: {
                                click: () => {
                                    this.$router.push({
                                        path: '/colonyLayout/serviceMg',
                                        query: { index: 1}
                                    })
                                }
                            }
                        }, '服务管理'),
                        h('Button', {
                            class: 'k-btn',
                            on: {
                                click: () => {
                                    this.goAdjunction(params.row)
                                }
                            }
                        }, '修改'),
                        h('Button', {
                            class: 'k-btn',
                            on: {
                                click: () => {
                                    this.restart()
                                }
                            }
                        }, '重启')
                    ]);
                }
            }],
            data: []
        }
    },
    mounted () {
        this.loadDeviceList();

       
    },
    methods: {
        goAdjunction(row){
            this.$refs.configRef.openConfig({
                title: '修改设备',
                row
            });
        },
        goAnalysis(title){
            this.$refs.analysisRef.openModel({
                title
            })
        },
        goAnalysis2(title){
            this.$refs.analysis2Ref.openModel({
                title
            })
        },

        // 重启操作
        restart(){
            alert('重启')
        },
        
        // 设备列表
        loadDeviceList(){
            let _self = this
            fetchDeviceListApi().then(function(data){
                _self.data = data.body.content;
                _self.filtersVariable(0, data.body.custom.variable);
                _self.filtersVariable(1, data.body.custom.variable2);
                _self.filtersVariable(2, data.body.custom.variable3);
            }).catch(function(err){
                // console.log(err)
                _self.$Modal.error({
                    title: '错误',
                    content: err.statusText
                });
            })
        }
    },
    components: {
        DeviceMgAdjunction,
        Analysis,
        Analysis2
    }
}
</script>

<style scoped>

</style>
