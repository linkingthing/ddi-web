<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">黑名单配置</span>
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
                    <Input class="in_input" search enter-button="查询" placeholder="请输入IP查询" size="large" />
                </div>
            </div>
            <div class="table-s">
                <table class="table-default" ref="ele">
                    <thead>
                        <tr>
                            <th width="220">IP地址</th>
                            <th width="136">掩码/前缀</th>
                            <th width="136">IP类型</th>
                            <th width="100">状态</th>
                            <th width="280">备注</th>
                            <th width="240">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>240c::11</td>
                            <td>128</td>
                            <td>IPv6</td>
                            <td>
                                <span class="state">允许访问</span>
                            </td>
                            <td>备注</td>
                            <td>
                                <i-button class="k-btn" @click="goConfig('修改')">修改</i-button>
                                <i-button class="k-btn">停用</i-button>
                                <i-button class="k-btn">删除</i-button>
                            </td>
                        </tr>
                        <tr>
                            <td>192.168.5.1</td>
                            <td>32</td>
                            <td>IPv4</td>
                            <td>
                                <span class="state err">禁止访问</span>
                            </td>
                            <td>备注</td>
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
        <blacklist-config ref="configRef"></blacklist-config>
    </div>
</template>

<script>
import blacklistConfig from '../components/BlacklistConfig';
export default {
    name: 'Blacklist',
    data () {
        return {
        
        }
    },
    mounted () {
       
    },
    methods: {
       goConfig(type){
            let title = '黑名单配置-新增';
            if(type == '修改'){
                title = '黑名单配置-修改';
            }
            this.$refs.configRef.openModel({
                title: title
            });
        }
    },
    components: {
        blacklistConfig
    }
}
</script>

<style scoped>
    a{
        text-decoration:none!important;
    }
</style>
