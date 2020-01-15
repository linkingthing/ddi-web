<template>
    <modal
        v-model="roleConfig"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="530"
        :closable="false">
        <div slot="header">{{dataConfig.title}}</div>
        <div>
            <i-form 
            :model="dataConfig" 
            label-position="right"
            :label-width="80">
                <div class="pop-content">
                    <div class="pop-box">
                        <p class="title">角色信息</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="角色名称" :label-width="70">
                                            <i-input v-model="dataConfig.t1" placeholder="请填写角色名称"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="roleConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'RoleConfig',
    data () {
        return {
            roleConfig: false,
            dataConfig: {
                title: '',
                t1: ''
            }
        }
    },
    methods: {
        openModel(data){
            this.roleConfig = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped lang="less">
 .pop-body{
     padding-bottom: 0;
 }
</style>
