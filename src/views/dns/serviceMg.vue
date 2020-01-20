<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <Breadcrumb>
                <router-link to="/colonyLayout/deviceMg">
                    <span class="tit back">
                        <Icon type="ios-arrow-back" size="26"/>
                    </span>
                </router-link>
                <BreadcrumbItem to="/colonyLayout/deviceMg">设备管理</BreadcrumbItem>
                <BreadcrumbItem>服务管理</BreadcrumbItem>
            </Breadcrumb>
            
        </div>
        <div class="table-box">
            <div class="table-s">
                <table class="table-default">
                    <thead>
                        <tr>
                            <th width="120">设备名称</th>
                            <th width="120">集群组</th>
                            <th width="150">应用层转换服务</th>
                            <th width="150">网络层转换服务</th>
                            <th width="150">集群服务</th>
                            <th width="150">应用防火墙服务</th>
                            <th width="150">流量控制服务</th>
                            <th width="120">域名解析服务</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{list[_index].t1}}</td>
                            <td>{{list[_index].t2}}</td>
                            <td>
                                <a href="javascript:" @click="switchFn1()">重启</a>
                            </td>
                            <td>
                                <a href="javascript:" @click="switchFn2()">重启</a>
                            </td>
                            <td>
                                <a href="javascript:" @click="switchFn3()">重启</a>
                            </td>
                            <td>
                                <a href="javascript:" @click="switchFn4()">重启</a>
                            </td>
                            <td>
                                <a href="javascript:" @click="switchFn5()">重启</a>
                            </td>
                            <td>
                                <a href="javascript:" @click="switchFn6()">重启</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'serviceMg',
    data () {
        return {
            list: [{
                t1: 'ate1',
                t2: 'ate_G1'
            },{
                t1: 'ate2',
                t2: 'ate_G2'
            }],
            _index: 0
        }
    },
    created () {
        this._index = this.$route.query.index
    },
    methods: {
        switchFn1(){
            this.$Modal.warning({
                title: '警告',
                content: '确定重启服务？',
                onOk: () => {
                    this.$loading('重启中...');
                    setTimeout(()=>{
                        this.$loading.close();
                        this.$Message.success('重启成功');
                    },2000)
                }
            })
        },
        switchFn2(){
            this.$Modal.warning({
                title: '警告',
                content: '确定重启服务？',
                onOk: () => {
                    this.$loading('重启中...');
                    setTimeout(()=>{
                        this.$loading.close();
                        this.$Message.success('重启成功');
                    },2000)
                }
            })
        },
        switchFn3(){
            this.$Modal.warning({
                title: '警告',
                content: '确定重启服务？',
                onOk: () => {
                    this.$loading('重启中...');
                    setTimeout(()=>{
                        this.$loading.close();
                        this.$Message.success('重启成功');
                    },2000)
                }
            })
        },
        switchFn4(){
            this.$Modal.warning({
                title: '警告',
                content: '确定重启服务？',
                onOk: () => {
                    this.$loading('重启中...');
                    setTimeout(()=>{
                        this.$loading.close();
                        this.$Message.success('重启成功');
                    },2000)
                }
            })
        },
        switchFn5(){
            this.$Modal.warning({
                title: '警告',
                content: '确定重启服务？',
                onOk: () => {
                    this.$loading('重启中...');
                    setTimeout(()=>{
                        this.$loading.close();
                        this.$Message.success('重启成功');
                    },2000)
                }
            })
        },
        switchFn6(){
            this.$Modal.warning({
                title: '警告',
                content: '确定重启服务？',
                onOk: () => {
                    this.$loading('重启中...');
                    setTimeout(()=>{
                        this.$loading.close();
                        this.$Message.success('重启成功');
                    },2000)
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
