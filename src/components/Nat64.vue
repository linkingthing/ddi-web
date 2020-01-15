<template>
    <modal
        v-model="nat64Modal"
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
                        <p class="title">配置内容</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item label="集群" :label-width="100" prop="t1">
                                            <i-select v-model="dataConfig.t1">
                                                <i-option value="集群">集群</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="协议类型" prop="t2">
                                            <i-select v-model="dataConfig.t2">
                                                <i-option value="HTTP">HTTP</i-option>
                                                <i-option value="HTTPS">HTTPS</i-option>
                                                <i-option value="TCP">TCP</i-option>
                                                <i-option value="UDP">UDP</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="IPv4地址" :label-width="100" prop="t3">
                                            <i-input v-model="dataConfig.t3" placeholder="请填写IPv4地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="IPv4端口"
                                        prop="t4">
                                            <i-input v-model="dataConfig.t4" placeholder="请填写IPv4端口"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="IPv6地址" :label-width="100" prop="t5">
                                            <i-input v-model="dataConfig.t5" placeholder="请填写IPv6地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="IPv6端口" 
                                        prop="t6">
                                            <i-input v-model="dataConfig.t6" placeholder="请填写IPv6端口"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="最大会话数" :label-width="100" prop="t7">
                                            <i-input v-model="dataConfig.t7" placeholder="每条静态映射规则允许最大会话数"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12"></i-col>
                                </Row>
                            </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="nat64Modal = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn" @click="handleSubmit">应用</i-button>
        </div>
    </modal>
</template>

<script>
import {isEmpty, isNumber, isIPv4, isIPv6} from '../util/common'
export default {
    name: 'Nat64',
    data () {
        // IPv4地址
        const validator1 = (rule, value, callback) => {
            if (!isEmpty(value) || !isIPv4(value)) {
                callback(new Error('请输入IPv4地址'));
            }else {
                callback();
            }
        };
        // IPv4端口
        const validator2 = (rule, value, callback) => {
            if (!isEmpty(value) || !isNumber(value)) {
                callback(new Error('请输入IPv4端口'));
            }else if(isNumber(value) && value<0){
                callback(new Error('请输入IPv4端口'));
            }else {
                callback();
            }
        };
        // IPv6地址
        const validator3 = (rule, value, callback) => {
            if (!isEmpty(value) || !isIPv6(value)) {
                callback(new Error('请输入IPv6地址'));
            }else {
                callback();
            }
        };
        // IPv4端口
        const validator4 = (rule, value, callback) => {
            if (!isEmpty(value) || !isNumber(value)) {
                callback(new Error('请输入IPv4端口'));
            }else if(isNumber(value) && value<0){
                callback(new Error('请输入IPv4端口'));
            }else {
                callback();
            }
        };
        // 最大会话数
        const validator5 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入最大会话数'));
            }else if(!isNumber(value)){
                callback(new Error('请输入数值'));
            }else if(isNumber(value) && value<0){
                callback(new Error('数值不能小于0'));
            }else {
                callback();
            }
        };
        return {
            nat64Modal: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: '',
                t3: '',
                t4: '',
                t5: '2001:A:B:C::D',
                t6: '443',
                t7: 100000
            },
            // 表单验证规则
            ruleValidate: {
                t1: [{ required: true, message: '请选择集群', trigger: 'change' }],
                t2: [{ required: true, message: '请选择协议类型', trigger: 'change' }],
                t3: [{ required: true, validator: validator1, trigger: 'blur' }],
                t4: [{ required: true, validator: validator2, trigger: 'blur' }],
                t5: [{ required: true, validator: validator3, trigger: 'blur' }],
                t6: [{ required: true, validator: validator4, trigger: 'blur' }],
                t7: [{ required: true, validator: validator5, trigger: 'blur' }],
            }
        }
    },
    methods: {
        openModel(data){
            this.nat64Modal = true;
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
        }
    }
}
</script>

<style scoped>
 
</style>
