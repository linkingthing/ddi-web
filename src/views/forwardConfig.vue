<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">转发配置</span>
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
                    <Input class="in_input" search enter-button="查询" placeholder="请输入域名查询" size="large" />
                </div>
            </div>
            <div class="table-s">
                <table class="table-default" ref="ele">
                    <thead>
                        <tr>
                            <th width="140">请求域名</th>
                            <th width="155">转发地址</th>
                            <th width="185">备注</th>
                            <th width="120">停启状态</th>
                            <th width="136">创建时间</th>
                            <th width="136">修改时间</th>
                            <th width="242">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>www.reyzar.com</td>
                            <td>144.144.144.144</td>
                            <td>全部解析需求转发给114.114.114.114处理</td>
                            <td>
                                <span class="state err">停用</span>
                            </td>
                            <td>2019-04-25 02:53:24</td>
                            <td>2019-04-25 02:53:24</td>
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
        <forward-config ref="configRef"></forward-config>
    </div>
</template>

<script>
import forwardConfig from '../components/ForwardConfig';
export default {
    name: 'ForwardConfig',
    data () {
        return {
        
        }
    },
    mounted () {
       
    },
    methods: {
       goConfig(type){
            let title = '转发配置-新增';
            if(type == '修改'){
                title = '转发配置-修改';
            }
            this.$refs.configRef.openModel({
                title: title
            });
        }
    },
    components: {
        forwardConfig
    }
}
</script>

<style scoped>
    a{
        text-decoration:none!important;
    }
</style>
