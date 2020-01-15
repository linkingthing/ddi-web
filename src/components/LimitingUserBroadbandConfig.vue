<template>
    <modal
        v-model="LimitingUserBroadbandConfig"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="961"
        :closable="false">
        <div slot="header">{{hsP?title:'参数设置-详情'}}</div>
        <div>
            <i-form 
            :model="dataConfig" 
            label-position="right"
            ref="formValidate"
            :rules="ruleValidate"
            :label-width="110">
                <div class="pop-content">
                    <div class="pop-box">
                        <p class="title">资源类型</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="资源类型名称" prop="filterContent">
                                            <i-input v-model="dataConfig.filterContent" placeholder="请输入资源类型名称" :disabled="!hsP"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="备注" prop="comment">
                                            <i-input v-model="dataConfig.comment" type="textarea" :autosize="true" placeholder="请输入备注" :disabled="!hsP"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="cancelModel">取消</i-button>
            <i-button type="primary" class="me-button add-btn" v-if="!loading" @click="handleSubmit" :disabled="!hsP">应用</i-button>
            <i-button type="primary" class="me-button add-btn" :loading="loading" v-else>应用</i-button>
        </div>
    </modal>
</template>

<script>
import {raltConfigSetRaltParamInfoApi,raltConfigUpdateRaltParamInfoApi} from '../service/index'
import {isEmpty} from '../util/common'
import { mapState } from 'vuex'

export default {
    name: 'LimitingUserBroadbandConfig',
    computed: {
        ...mapState({
            colony: state => state.cluster.colony
        })
    },
    data () {
        // 备注校验
        const validator = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback();
            }else if(String(value).length>30){
                callback(new Error('备注最多输入30个字符'));
            }else {
                callback();
            }
        }
        return {
            LimitingUserBroadbandConfig: false,
            title: '',
            dataConfig: {
                filterContent: '',
                comment: ''
            },
            id: null,
            loading: false,
            hsP: false,
            ruleValidate: {
                filterContent: [{ required: true, message: '请输入资源类型名称', trigger: 'blur' }],
                comment: [{ validator: validator, trigger: 'blur' }],
            }
        }
    },
    mounted () {
        this.hsP = this.userHsPower('front:ralt:upgrade');   
    },
    methods: {
        openModel(data){
            this.$refs.formValidate.resetFields();
            this.title = data.title;
            if(this.title == '参数设置-修改'){
                this.id = data.obj.id
                this.dataConfig.filterContent = data.obj.filterContent;
                this.dataConfig.comment = data.obj.comment;
                this.LimitingUserBroadbandConfig = true;
            }else{this.LimitingUserBroadbandConfig = true;}
        },
        cancelModel() {
            this.LimitingUserBroadbandConfig = false
            this.$refs.formValidate.resetFields()
        },

        handleSubmit(){
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    if(this.title=='参数设置-新增'){
                        this.raltConfigSetRaltParamInfo()
                    }else{
                        this.raltConfigUpdateRaltParamInfo()
                    }
                }
            })
        },
        
        raltConfigSetRaltParamInfo(){
            this.loading = true;
            this.$loading('应用中...');
            raltConfigSetRaltParamInfoApi(JSON.stringify({clusterId:this.colony,filterContent: this.dataConfig.filterContent,comment: this.dataConfig.comment})).then(data=>{
                this.loading = false;
                if(data.body.type == 'success'){
                    this.LimitingUserBroadbandConfig = false;
                    this.$Message.success({content: data.body.content})
                    this.$parent.raltConfigGetRaltParamInfo();
                }else{
                    this.$Modal.error({title: '错误',content: data.body.content});
                }
                this.$loading.close();
            }).catch(err=>{
                this.loading = false;
                this.$Modal.error({title: '错误',content: err.message});
                this.$loading.close();
            })
        },

        raltConfigUpdateRaltParamInfo(){
            this.loading = true;
            this.$loading('应用中...');
            raltConfigUpdateRaltParamInfoApi(JSON.stringify({id: this.id,clusterId:this.colony,filterContent: this.dataConfig.filterContent,comment: this.dataConfig.comment})).then(data=>{
                this.loading = false;
                if(data.body.type == 'success'){
                    this.LimitingUserBroadbandConfig = false;
                    this.$Message.success({content: data.body.content})
                    this.$parent.raltConfigGetRaltParamInfo();
                }else{
                    this.$Modal.error({title: '错误',content: data.body.content});
                }
                this.$loading.close();
            }).catch(err=>{
                this.loading = false;
                this.$Modal.error({title: '错误',content: err.message});
                this.$loading.close();
            })
        }

    }
}
</script>

<style scoped lang="less">
 .pop-body{
     padding-bottom: 0;
 }
</style>
