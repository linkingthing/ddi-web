<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">IP库配置</span>
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
                    <Input class="in_input" search enter-button="查询" placeholder="请输入IP查询" size="large" />
                </div>
            </div>
            <div class="table-s">
                <table class="table-default" ref="ele">
                    <thead>
                        <tr>
                            <th width="190">IP段(掩码)</th>
                            <th width="190">起始IP</th>
                            <th width="190">结束IP</th>
                            <th width="100">IP类型</th>
                            <th width="100">链路名称</th>
                            <th width="180">创建时间</th>
                            <th width="180">修改时间</th>
                            <th width="172">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>-</td>
                            <td>88.8.8.9</td>
                            <td>88.8.8.9</td>
                            <td>IPv4</td>
                            <td>中国移动</td>
                            <td>创建时间</td>
                            <td>修改时间</td>
                            <td>
                                <i-button class="k-btn" @click="goConfig('修改')">修改</i-button>
                                <i-button class="k-btn">删除</i-button>
                            </td>
                        </tr>
                        <tr>
                            <td>240c:1:1:3:/48</td>
                            <td>-</td>
                            <td>-</td>
                            <td>IP6</td>
                            <td>中国移动</td>
                            <td>创建时间</td>
                            <td>修改时间</td>
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
        <ip-library-config ref="configRef"></ip-library-config>
    </div>
</template>

<script>
import ipLibraryConfig from '../components/IpLibraryConfig';
export default {
    name: 'IpLibrary',
    data () {
        return {
        
        }
    },
    mounted () {
       
    },
    methods: {
       goConfig(type){
            let title = 'IP库配置-新增';
            if(type == '修改'){
                title = 'IP库配置-修改';
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
        ipLibraryConfig
    }
}
</script>

<style scoped>
    a{
        text-decoration:none!important;
    }
</style>
