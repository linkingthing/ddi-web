<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">角色管理</span>
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
                    <Input class="in_input" search enter-button="查询" placeholder="请输入角色名称查询" size="large" />
                </div>
            </div>
            <div class="table-s">
                <table class="table-default" ref="ele">
                    <thead>
                        <tr>
                            <th width="553">角色名称</th>
                            <th width="553">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>系统管理员</td>
                            <td>
                                <i-button class="k-btn" @click="goPowerConfig">权限管理</i-button>
                                <i-button class="k-btn" @click="goConfig('修改')">修改</i-button>
                                <i-button class="k-btn">删除</i-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
        <role-config ref="configRef"></role-config>
        <power-config ref="powerConfigRef"></power-config>
    </div>
</template>

<script>
import roleConfig from '../components/RoleConfig';
// import powerConfig from '../components/PowerConfig';

export default {
    name: 'roleMg',
    data () {
        return {
        
        }
    },
    mounted () {
       
    },
    methods: {
       goConfig(type){
            let title = '新增角色';
            if(type == '修改'){
                title = '修改角色';
            }
            this.$refs.configRef.openModel({
                title: title
            });
        },
        goPowerConfig(){
            this.$refs.powerConfigRef.openModel();
        }
    },
    components: {
        roleConfig,
        powerConfig
    }
}
</script>

<style scoped>

</style>
