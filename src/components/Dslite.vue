<template>
    <modal
        v-model="dslite"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="961"
        :closable="false">
        <div slot="header">{{dataConfig.title}}</div>
        <div>
            <i-form 
                :model="dataConfig" 
                label-position="right"
                :label-width="110"
                :rules="ruleValidate"
                ref="formValidate">
                <div class="pop-content">
                    <div class="pop-box">
                        <p class="title">配置内容</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item label="IPv4组播地址" prop="t1">
                                            <i-input v-model="dataConfig.t1" placeholder="请填写IPv4组播地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="IPv6组播地址" prop="t2">
                                            <i-input v-model="dataConfig.t2" placeholder="请填写IPv6组播地址"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                
                            </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="dslite = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn" @click="handleSubmit">应用</i-button>
        </div>
    </modal>
</template>

<script>
import {isEmpty, isIPv6} from '../util/common'
export default {
    name: 'Dslite',
    data () {
        // IPv4组播地址
        const validator1 = (rule, value, callback) => {
            if (!isEmpty(value) || !isIPv4(value)) {
                callback(new Error('请输入IPv4组播地址'));
            }else {
                callback();
            }
        };
        // IPv4组播地址
        const validator2 = (rule, value, callback) => {
            if (!isEmpty(value) || !isIPv6(value)) {
                callback(new Error('请输入IPv6组播地址'));
            }else {
                callback();
            }
        };
        return {
            dslite: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: ''
            },
            // 表单验证规则
            ruleValidate: {
                t1: [{ required: true, validator: validator1, trigger: 'blur' }],
                t2: [{ required: true, validator: validator2, trigger: 'blur' }]
            }
        }
    },
    methods: {
        openModel(data){
            this.dslite = true;
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
