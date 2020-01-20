<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <router-link to="/dnsLayout/forwardDomain">
                <span class="tit back">
                    <Icon type="ios-arrow-back" size="26"/>
                </span>
            </router-link>
            <span class="back-title">解析设置reyzar.com</span>
            <div class="button-box fr">
                <!-- <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goAdjunction(0)">新增</i-button> -->
            </div>
        </div>
        <div class="table-box">
            <div class="table-query clearfix">
                <div class="button-box fl">
                    <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig('新增')">新增</i-button>
                    <Upload action="//jsonplaceholder.typicode.com/posts/" :show-upload-list="false" 
                    :before-upload="importBefore"
                    :on-success="importSuccess" 
                    :on-error="importErr">
                        <i-button class="me-button k-btn">批量导入</i-button>
                    </Upload>
                    <i-button class="me-button k-btn">批量导出</i-button>
                    <i-button class="me-button k-btn">摸板下载</i-button>
                </div>
                <div class="query-box clearfix fr">
                    <Input class="in_input" search enter-button="查询" placeholder="请输入域名查询" size="large" />
                </div>
            </div>
            <div class="table-s">
                <table class="table-default" ref="ele">
                    <thead>
                        <tr>
                            <th width="90">主机记录</th>
                            <th width="87">记录类型</th>
                            <th width="90">解析路线</th>
                            <th width="100">记录值</th>
                            <th width="70">TTL</th>
                            <th width="95">MX优先级</th>
                            <th width="98">状态</th>
                            <th width="98">停启状态</th>
                            <th width="240">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>www</td>
                            <td>AAAA</td>
                            <td>电信</td>
                            <td>240e:fb:afff:e101::1111</td>
                            <td>10分钟</td>
                            <td>-</td>
                            <td>
                                <span class="state">正常</span>
                            </td>
                            <td>
                                <span class="state err">停用</span>
                            </td>
                            <td>
                                <i-button class="k-btn" @click="goConfig('修改')">修改</i-button>
                                <i-button class="k-btn">启用</i-button>
                                <i-button class="k-btn">删除</i-button>
                            </td>
                        </tr>
                        <tr>
                            <td>www</td>
                            <td>AAAA</td>
                            <td>联通</td>
                            <td>240e:fb:afff:e101::1111</td>
                            <td>10分钟</td>
                            <td>-</td>
                            <td>
                                <span class="state err">异常</span>
                            </td>
                            <td>
                                <span class="state">启用</span>
                            </td>
                            <td>
                                <i-button class="k-btn" @click="goConfig('修改')">修改</i-button>
                                <i-button class="k-btn">停用</i-button>
                                <i-button class="k-btn">删除</i-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
        <analytical-setup-config ref="configRef"></analytical-setup-config>
    </div>
</template>

<script>
import analyticalSetupConfig from '@/components/AnalyticalSetupConfig';
export default {
    name: 'AnalyticalSetup',
    data () {
        return {
        
        }
    },
    mounted () {
       
    },
    methods: {
       goConfig(type){
            let title = '解析设置-新增';
            if(type == '修改'){
                title = '解析设置-修改';
            }
            this.$refs.configRef.openModel({
                title: title
            });
        },
        // 导入失败
        importErr(error, file, fileList){
            this.$Message.destroy()
            this.$Modal.error({
                title: '错误',
                content: '导入失败'
            });
        },
        // 导入成功
        importSuccess(response, file, fileList){
            this.$Message.destroy()
            this.$Modal.success({
                title: '成功',
                content: '导入成功'
            });
        },
        // 导入前
        importBefore(event, file, fileList){
            this.$Message.loading({
                content: '上传中...',
                duration: 0
            });
        },
    },
    components: {
        analyticalSetupConfig
    }
}
</script>

<style scoped lang="less">
@import '../assets/less/var';

.back-title{
    font-size: @f14;
    font-weight: bold;
}
</style>
