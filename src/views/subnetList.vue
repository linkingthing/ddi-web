<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">子网列表</span>
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
                    <Input class="in_input" search enter-button="查询" placeholder="请输入子网名查询" size="large" />
                </div>
            </div>
            <div class="table-s">
                <table class="table-default" ref="ele">
                    <thead>
                        <tr>
                            <th width="210">子网名称</th>
                            <th width="150">网口</th>
                            <th width="255">IPv4网段</th>
                            <th width="320">IPv6网段</th>
                            <th width="170">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>人事部</td>
                            <td>eth0</td>
                            <td>192.168.1.0/24</td>
                            <td>240c:0:0:ff::/64</td>
                            <td>
                                <i-button class="k-btn" @click="goConfig('修改')">修改</i-button>
                                <i-button class="k-btn">删除</i-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
        <subnet-list-config ref="configRef"></subnet-list-config>
    </div>
</template>

<script>
import subnetListConfig from '../components/SubnetListConfig';
export default {
    name: 'SubnetListConfig',
    data () {
        return {
        
        }
    },
    mounted () {
       
    },
    methods: {
       goConfig(type){
            let title = '新增子网';
            if(type == '修改'){
                title = '修改子网';
            }
            this.$refs.configRef.openModel({
                title: title
            });
        }
    },
    components: {
        subnetListConfig
    }
}
</script>

<style scoped>
    a{
        text-decoration:none!important;
    }
</style>
