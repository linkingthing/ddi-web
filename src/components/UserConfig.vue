<template>
    <modal
        v-model="userConfig"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="961"
        :closable="false">
        <div slot="header">{{dataConfig.title}}</div>
        <div>
            <i-form 
            :model="dataConfig" 
            label-position="right"
            :label-width="80"
            :rules="ruleValidate"
            ref="formValidate">
                <div class="pop-content">
                    <div class="pop-box">
                        <p class="title">用户信息</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item label="账号名称" :label-width="100" prop="t1">
                                            <i-input v-model="dataConfig.t1" placeholder="请填写账号名称"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="账号密码" :label-width="100" prop="t2">
                                            <i-input v-model="dataConfig.t2" type="password" placeholder="请填写账号密码"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="所属角色" :label-width="100" prop="t3">
                                            <i-select v-model="dataConfig.t3">
                                                <i-option value="系统管理员">系统管理员</i-option>
                                                <i-option value="业务操作员">业务操作员</i-option>
                                                <i-option value="客户代表">客户代表</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="用户姓名" :label-width="100">
                                            <i-input v-model="dataConfig.t4" placeholder="请填写用户姓名"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item label="用户电话" :label-width="100">
                                            <i-input v-model="dataConfig.t5" placeholder="请填写用户电话"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="用户邮箱" :label-width="100">
                                            <i-input v-model="dataConfig.t6" placeholder="请填写用户邮箱"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="21">
                                        <form-item 
                                        label="可查看网站" :label-width="100">
                                            <i-input class="l-w" style="width: 692px;" v-model="dataConfig.t7" type="textarea" :autosize="{minRows: 2}" placeholder="请填写可查看网站"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="2" class="poptip">
                                        <Poptip trigger="hover" placement="right">
                                            <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                            <div slot="content">
                                                <p>可添加多个,请用“,”分号分割。</p>
                                            </div>
                                        </Poptip>
                                    </i-col>
                                </Row>
                            </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="userConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn" @click="handleSubmit">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'UserConfig',
    data () {
        return {
            userConfig: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: '',
                t3: '客户代表',
                t4: '',
                t5: '',
                t6: '',
                t7: '',
            },
            // 表单验证规则
            ruleValidate: {
                t1: [{ required: true, message: '请填写账号名称', trigger: 'blur' }],
                t2: [{ required: true, message: '请填写账号密码', trigger: 'blur' }],
                t3: [{ required: true, message: '请填写所属角色', trigger: 'blur'}]
            }
        }
    },
    methods: {
        openModel(data){
            this.userConfig = true;
            this.dataConfig.title = data.title;
        },
        // 应用
        handleSubmit(){
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.$Message.success('成功!');
                } else {
                    this.$Message.error('错误');
                }
            })
        },
    }
}
</script>

<style scoped>
 
</style>
