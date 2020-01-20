<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">告警设置</span>
            <div class="button-box fr"></div>
        </div>
        <div class="index-03 table-box">
            <p class="title">告警设置
                <!-- <a href="" class="more">更多>></a> -->
            </p>
            <div class="index-03-c page-form in_mb">
                <i-form 
                :model="dataConfig" 
                label-position="right"
                :rules="ruleValidate"
                :label-width="80"
                ref="formValidate">
                    <div class="page-group in_mb" style="margin-bottom:0">
                        <Row>
                            <i-col span="24">
                                <form-item 
                                label="告警阀值" class="tit"></form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="8">
                                <form-item 
                                label="CPU(%)"
                                prop="t1">
                                    <i-input v-model="dataConfig.t1" placeholder="请填写CPU" class="w210"></i-input>
                                </form-item>
                            </i-col>
                            <i-col span="8">
                                <form-item 
                                label="网络流量(%)" :label-width="116"
                                prop="t2">
                                    <i-input v-model="dataConfig.t2" placeholder="请填写网络流量" class="w210"></i-input>
                                </form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="8">
                                <form-item 
                                label="存储(%)"
                                prop="t3">
                                    <i-input v-model="dataConfig.t3" placeholder="请填写存储" class="w210"></i-input>
                                </form-item>
                            </i-col>
                            <i-col span="8">
                                <form-item 
                                label="告警频率(分钟)" :label-width="116" prop="t4">
                                    <i-select v-model="dataConfig.t4" class="w210">
                                        <i-option value="5">5分钟</i-option>
                                        <i-option value="10">10分钟</i-option>
                                        <i-option value="15">15分钟</i-option>
                                        <i-option value="30">30分钟</i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="8">
                                <form-item 
                                label="内存(%)"
                                prop="t5">
                                    <i-input v-model="dataConfig.t5" placeholder="请填写内存" class="w210"></i-input>
                                </form-item>
                            </i-col>
                            <i-col span="8"></i-col>
                        </Row>

                        <Row>
                            <i-col span="24">
                                <form-item 
                                label="业务监控" class="tit"></form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="8">
                                <form-item 
                                label="监控频率(分钟)"
                                :label-width="116"
                                prop="t6">
                                    <i-select v-model="dataConfig.t6" class="w210">
                                        <i-option value="5">5分钟</i-option>
                                        <i-option value="10">10分钟</i-option>
                                        <i-option value="15">15分钟</i-option>
                                        <i-option value="30">30分钟</i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                            <i-col span="8">
                                <form-item 
                                label="告警级别"
                                prop="t7">
                                    <i-select v-model="dataConfig.t7" class="w210">
                                        <i-option value="信息">信息</i-option>
                                        <i-option value="告警">告警</i-option>
                                        <i-option value="错误">错误</i-option>
                                        <i-option value="严重">严重</i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                        </Row>
                        
                        <Row>
                            <i-col span="24">
                                <form-item 
                                label="告警配置" class="tit"></form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="8">
                                <form-item 
                                label="告警方式"
                                prop="alarm">
                                    <i-select v-model="dataConfig.alarm" class="w210">
                                        <i-option value="wx">企业微信</i-option>
                                        <i-option value="email">邮箱</i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                            <i-col span="8" v-show="dataConfig.alarm=='wx'">
                                <form-item 
                                label="CorpID"
                                prop="t8">
                                    <i-input v-model="dataConfig.t8" placeholder="请填写CorpID" class="w210"></i-input>
                                </form-item>
                            </i-col>
                            <i-col span="8" v-show="dataConfig.alarm=='email'">
                                <form-item 
                                label="邮箱地址"
                                prop="t9">
                                    <i-input v-model="dataConfig.t9" placeholder="请填写邮箱地址" class="w210"></i-input>
                                </form-item>
                            </i-col>
                        </Row>
                        <Row >
                            <i-col span="8" v-show="dataConfig.alarm=='wx'">
                                <form-item 
                                label="Secret"
                                prop="t10">
                                    <i-input v-model="dataConfig.t10" placeholder="请填写Secret" class="w210"></i-input>
                                </form-item>
                            </i-col>
                            <i-col span="8" v-show="dataConfig.alarm=='wx'">
                                <form-item 
                                label="应用ID"
                                prop="t11">
                                    <i-input v-model="dataConfig.t11" placeholder="请填写应用ID" class="w210"></i-input>
                                </form-item>
                            </i-col>
                        </Row>
                    </div>
                    <i-button type="primary" class="me-button save-btn" @click="handleSubmit">保存</i-button>
                </i-form>
            </div>
        </div>
    </div>
</template>

<script>
import {isEmpty, isNumber} from '@/util/common'
export default {
    name: 'sysConfig',
    data () {
        // CPU
        const validator15 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请填写CPU'));
            }else if(!isNumber(value)){
                callback(new Error('请正确填写CPU'));
            }else if(isNumber(value) && value<0 && value>100){
                callback(new Error('请正确填写CPU'));
            }else {
                callback();
            }
        };
        // 网络流量
        const validator16 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请填写网络流量'));
            }else if(!isNumber(value)){
                callback(new Error('请正确填写网络流量'));
            }else if(isNumber(value) && value<0 && value>100){
                callback(new Error('请正确填写网络流量'));
            }else {
                callback();
            }
        };
        // 存储
        const validator17 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请填写存储'));
            }else if(!isNumber(value)){
                callback(new Error('请正确填写存储'));
            }else if(isNumber(value) && value<0 && value>100){
                callback(new Error('请正确填写存储'));
            }else {
                callback();
            }
        };
        // 内存
        const validator18 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请填写内存'));
            }else if(!isNumber(value)){
                callback(new Error('请正确填写内存'));
            }else if(isNumber(value) && value<0 && value>100){
                callback(new Error('请正确填写内存'));
            }else {
                callback();
            }
        };
        // 监控频率
        const validator19 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请填写监控频率'));
            }else if(!isNumber(value)){
                callback(new Error('请正确填写数值'));
            }else if(isNumber(value) && value<0){
                callback(new Error('请正确填写数值'));
            }else {
                callback();
            }
        };

        return {
            dataConfig: {
                t1: '85',
                t2: '90',
                t3: '80',
                t4: '5',
                t5: '90',
                t6: '5',
                t7: '信息',
                t8: '',
                t9: '',
                t10: '',
                t11: '',
                alarm: 'email',
            },
            ruleValidate: {
                t1: [{ required: true, validator: validator15, trigger: 'blur' }],
                t2: [{ required: true, validator: validator16, trigger: 'blur' }],
                t3: [{ required: true, validator: validator17, trigger: 'blur' }],
                t5: [{ required: true, validator: validator18, trigger: 'blur' }],

                t8: [{ required: true, message: '请填写CorpID', trigger: 'blur' }],
                t9: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }],
                t10: [{ required: true, message: '请填写Secret', trigger: 'blur' }],
                t11: [{ required: true, message: '请填写应用ID', trigger: 'blur' }],
                alarm: [{ required: true, message: '请选择告警方式', trigger: 'change' }]
            }
        }
    },
    methods: {
        // 应用
        handleSubmit(){
            let canNext = true;

            this.$refs.formValidate.validateField('t1',function(msg){
                if(msg){
                    canNext = false;
                }
            })
            this.$refs.formValidate.validateField('t2',function(msg){
                if(msg){
                    canNext = false;
                }
            })
            this.$refs.formValidate.validateField('t3',function(msg){
                if(msg){
                    canNext = false;
                }
            })
            this.$refs.formValidate.validateField('t3',function(msg){
                if(msg){
                    canNext = false;
                }
            })
            this.$refs.formValidate.validateField('t5',function(msg){
                if(msg){
                    canNext = false;
                }
            })

            if(this.dataConfig.alarm == 'email'){
                this.$refs.formValidate.validateField('t9',function(msg){
                    if(msg){
                        canNext = false;
                    }
                })
            }else if(this.dataConfig.alarm == 'wx'){
                this.$refs.formValidate.validateField('t8',function(msg){
                    if(msg){
                        canNext = false;
                    }
                })
                this.$refs.formValidate.validateField('t10',function(msg){
                    if(msg){
                        canNext = false;
                    }
                })
                this.$refs.formValidate.validateField('t11',function(msg){
                    if(msg){
                        canNext = false;
                    }
                })
            }

            if(canNext){
                this.$Message.success('成功!');
            }else{
                this.$Message.error('错误');
            }
        }
    }
}
</script>

<style scoped lang="less">
    .index-03{
        padding: 20px 30px;
        margin-top: 0;
    }
    .ivu-form-item{
        margin-bottom: 20px;
    }
</style>
