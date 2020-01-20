<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">链路端口配置</span>
            <div class="button-box fr">
                <!-- <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goAdjunction(0)">新增</i-button> -->
            </div>
        </div>
        <div class="table-box">
            <div class="table-query clearfix">
                <div class="button-box fl">
                    <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig('新增')">新增</i-button>
                </div>
                <div class="query-box clearfix fr">
                    <Input class="in_input" search enter-button="查询" placeholder="请输入链路名称查询" size="large" />
                </div>
            </div>
            <div class="table-s">
                <table class="table-default" ref="ele">
                    <thead>
                        <tr>
                            <th width="210">DNS主机</th>
                            <th width="152">网卡IP</th>
                            <th width="153">IP类型</th>
                            <th width="130">链路名称</th>
                            <th width="152">权重</th>
                            <th width="140">状态</th>
                            <th width="242">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>主机1</td>
                            <td>240::2::45</td>
                            <td>IPv6</td>
                            <td>联通</td>
                            <td>5</td>
                            <td>
                                <span class="state err">停用</span>
                            </td>
                            <td>
                                <i-button class="k-btn" @click="goConfig('修改')">修改</i-button>
                                <i-button class="k-btn">启用</i-button>
                                <i-button class="k-btn">删除</i-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
        <link-port-config ref="configRef"></link-port-config>
    </div>
</template>

<script>
import linkPortConfig from '@/components/LinkPortConfig';
export default {
    name: 'LinkPortConfig',
    data () {
        return {
        
        }
    },
    mounted () {
       
    },
    methods: {
       goConfig(type){
            let title = '链路端口配置-新增';
            if(type == '修改'){
                title = '链路端口配置-修改';
            }
            this.$refs.configRef.openModel({
                title: title
            });
        }
    },
    components: {
        linkPortConfig
    }
}
</script>

<style scoped>
    a{
        text-decoration:none!important;
    }
</style>
