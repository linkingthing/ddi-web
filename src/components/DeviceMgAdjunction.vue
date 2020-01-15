<template>
    <modal
        v-model="configModal"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="961"
        :closable="false">
        <div slot="header">{{title}}</div>
        <div>
            <i-form 
                :model="dataConfig" 
                label-position="right"
                :label-width="80"
                :rules="ruleValidate"
                ref="formValidate">
                <div class="pop-content">
                    <div class="pop-box">
                        <p class="title">基本信息</p>
                        <div class="pop-body">
                            <Row>
                                <i-col span="12">
                                    <form-item label="设备名称" :label-width="100" prop="name">
                                        <i-input v-model="dataConfig.name" placeholder="请输入设备名称"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item 
                                    label="设备类型" :label-width="100">
                                        <i-input v-model="typeName" placeholder="请输入设备类型" :disabled="true"></i-input>
                                    </form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="12">
                                    <form-item 
                                    label="IPv4管理地址"
                                    :label-width="100">
                                        <i-input v-model="dataConfig.ipv4Addr" placeholder="请输入IPv4管理地址" :disabled="true"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item 
                                    label="IPv6管理地址"
                                    :label-width="100">
                                        <i-input v-model="dataConfig.ipv6Addr" placeholder="请输入IPv6管理地址" :disabled="true"></i-input>
                                    </form-item>
                                </i-col>
                            </Row>
                            <!-- <Row>
                                <i-col span="12">
                                    <form-item 
                                    label="数据网卡IP" :label-width="100" prop="t5">
                                        <i-input v-model="dataConfig.t5" placeholder="请输入数据网卡IP"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="12"></i-col>
                            </Row> -->
                        </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="configModal = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn" @click="handleSubmit">应用</i-button>
        </div>
    </modal>
</template>

<script>
import {isURL} from '../util/common'

import { fetchDeviceUpdateApi } from '../service/index'

export default {
    name: 'DeviceMgAdjunction',
    data () {
        
        return {
            configModal: false,
            title: '',
            dataConfig: {
                name: '',
                type: '',
                ipv4Addr: '',
                ipv6Addr: ''
            },
            // 表单验证规则
            ruleValidate: {
                name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }]
            }
        }
    },
    computed: {
        typeName(){
            if(this.dataConfig.type == 1){
                return 'ATE'
            }else if(this.dataConfig.type == 2){
                return 'EAG'
            }else if(this.dataConfig.type == 3){
                return 'NTE'
            }
        }
    },
    methods: {
        openConfig(data){
            this.configModal = true;
            this.title = data.title;
            this.dataConfig = data.row;
        },
        // 应用
        handleSubmit(){
            let _self = this
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    fetchDeviceUpdateApi({
                        id: _self.dataConfig.id,
                        name: _self.dataConfig.name
                    }).then(function(data){
                        _self.configModal = false
                        _self.$Modal.success({
                            title: '提示',
                            content: data.body.content
                        });
                    }).catch(function(err){
                        _self.$Modal.error({
                            title: '错误',
                            content: err.statusText
                        });
                    })
                } else {
                    // this.$Message.error('错误');
                }
            })
        }
    }
}
</script>

<style scoped>
 
</style>
