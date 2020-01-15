<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">正向域名解析</span>
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
                            <th width="210">域名</th>
                            <th width="150">记录数量</th>
                            <th width="150">解析状态</th>
                            <th width="330">备注</th>
                            <th width="260">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>reyzar.com</td>
                            <td>45850</td>
                            <td>
                                正常:200
                                <br/>
                                <span class="state err">异常:1</span>
                            </td>
                            <td>本地隧道服务</td>
                            <td>
                                <i-button class="k-btn" @click="goConfig('修改')">修改</i-button>
                                <i-button class="k-btn" to="/dnsLayout/analyticalSetup">解析设置</i-button>
                                <i-button class="k-btn">删除</i-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
        <forward-domain-config ref="configRef"></forward-domain-config>
    </div>
</template>

<script>
import forwardDomainConfig from '../components/ForwardDomainConfig';
export default {
    name: 'ForwardDomain',
    data () {
        return {
        
        }
    },
    mounted () {
       
    },
    methods: {
       goConfig(type){
            let title = '新增域名';
            if(type == '修改'){
                title = '修改域名';
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
        forwardDomainConfig
    }
}
</script>

<style scoped>
    a{
        text-decoration:none!important;
    }
</style>
