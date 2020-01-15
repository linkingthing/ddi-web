<template>
    <modal
        v-model="staticBindingConfig"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="961"
        :closable="false">
        <div slot="header">{{dataConfig.title}}</div>
        <div>
            <i-form 
            :model="dataConfig" 
            label-position="right"
            :label-width="80">
                <div class="pop-content">
                    <div class="pop-box">
                        <p class="title">内容信息</p>
                        <div class="pop-body">
                            <Row>
                                <i-col span="12">
                                    <form-item label="绑定类型">
                                        <i-select v-model="dataConfig.t5">
                                            <i-option value="MAC">MAC</i-option>
                                            <i-option value="UUID">UUID</i-option>
                                        </i-select>
                                    </form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="12">
                                    <form-item :label="dataConfig.t5=='MAC'?'MAC地址':'UUID'">
                                        <i-input v-model="dataConfig.t1" :placeholder="dataConfig.t5=='MAC'?'请填写MAC地址':'请填写UUID'"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="租约时间" :class="{disColor:dataConfig.t5=='UUID'}">
                                        <i-input v-model="dataConfig.t2" placeholder="请填写租约时间" :disabled="dataConfig.t5=='UUID'"></i-input>
                                    </form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="12">
                                    <form-item label="IPv4地址" :class="{disColor:dataConfig.t5=='UUID'}">
                                        <i-input v-model="dataConfig.t3" placeholder="请填写IPv4地址" :disabled="dataConfig.t5=='UUID'"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="IPv6地址">
                                        <i-input v-model="dataConfig.t4" placeholder="请填写IPv6地址"></i-input>
                                    </form-item>
                                </i-col>
                            </Row>
                        </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="staticBindingConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'StaticBindingConfig',
    data () {
        return {
            staticBindingConfig: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: '',
                t3: '',
                t4: '',
                t5: 'MAC'
            }
        }
    },
    methods: {
        openModel(data){
            this.staticBindingConfig = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped>
 
</style>
