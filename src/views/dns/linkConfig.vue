<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">链路类型配置</span>
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
                            <th width="210">链路名称</th>
                            <th width="150">链路标识</th>
                            <th width="153">链路权值</th>
                            <th width="210">创建时间</th>
                            <th width="212">修改时间</th>
                            <th width="173">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>联通</td>
                            <td>CM</td>
                            <td>5</td>
                            <td>2019-04-25 02:53:24</td>
                            <td>2019-04-25 02:53:24</td>
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
        <link-config ref="configRef"></link-config>
    </div>
</template>

<script>
import linkConfig from '@/components/LinkConfig';
export default {
    name: 'LinkConfig',
    data () {
        return {
        
        }
    },
    mounted () {
       
    },
    methods: {
       goConfig(type){
            let title = '链路类型配置-新增';
            if(type == '修改'){
                title = '链路类型配置-修改';
            }
            this.$refs.configRef.openModel({
                title: title
            });
        }
    },
    components: {
        linkConfig
    }
}
</script>

<style scoped>
    a{
        text-decoration:none!important;
    }
</style>
