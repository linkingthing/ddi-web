<template>
    <modal
        v-model="thresholdModal"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="961"
        :closable="false">
        <div slot="header">设置告警阀值</div>
        <div>
            <i-form 
                :model="dataConfig" 
                label-position="right"
                :label-width="110"
                ref="thresholdModal"
                :rules="ruleValidate" >
                <div class="pop-content">
                    <div class="pop-box">
                        <p class="title">告警阀值信息</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item label="告警阀值名称">
                                            <i-input v-model="dataConfig.title" disabled></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="告警阀值单位">
                                            <i-input value="%" disabled></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="普通告警阀值"
                                        prop="t1">
                                            <i-input v-model="dataConfig.t1" type="number" placeholder="请输入整数或者小数，最多2位小数"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="次要告警阀值"
                                        prop="t2">
                                            <i-input v-model="dataConfig.t2" type="number" placeholder="请输入整数或者小数，最多2位小数"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="主要告警阀值"
                                        prop="t3">
                                            <i-input v-model="dataConfig.t3" type="number" placeholder="请输入整数或者小数，最多2位小数"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="严重告警阀值"
                                        prop="t4">
                                            <i-input v-model="dataConfig.t4" type="number" placeholder="请输入整数或者小数，最多2位小数"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="thresholdModal = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn" @click="handleSubmit('thresholdModal')">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'thresholdConfig',
    data () {
        return {
            thresholdModal: false,
            dataConfig: {
                title: '',
                t1: null,
                t2: null,
                t3: null,
                t4: null
            },
            // 表单校验
            ruleValidate: {
                t1: [{ 
                    required: true, message: '请输入整数或者小数，最多2位小数', trigger: 'blur'
                },{ 
                    message: '请输入整数或者小数，最多2位小数', trigger: 'blur', pattern: /(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,2}$)/
                }],
                t2: [{ 
                    required: true, message: '请输入整数或者小数，最多2位小数', trigger: 'blur' 
                },{ 
                    message: '请输入整数或者小数，最多2位小数', trigger: 'blur', pattern: /(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,2}$)/
                }],
                t3: [{ 
                    required: true, message: '请输入整数或者小数，最多2位小数', trigger: 'blur' 
                },{ 
                    message: '请输入整数或者小数，最多2位小数', trigger: 'blur', pattern: /(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,2}$)/
                }],
                t4: [{ 
                    required: true, message: '请输入整数或者小数，最多2位小数', trigger: 'blur' 
                },{ 
                    message: '请输入整数或者小数，最多2位小数', trigger: 'blur', pattern: /(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,2}$)/
                }]
            }
        }
    },
    methods: {
        openModel(data){
            this.thresholdModal = true;
            this.dataConfig.title = data.title;
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!');
                } else {
                    this.$Message.error('应用失败!');
                }
            })
        }
    }
}
</script>

<style scoped>
 
</style>
