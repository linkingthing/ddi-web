<template>
    <modal
        v-model="forwardConfig"
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
                        <p class="title">信息内容</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item label="请求域名" :label-width="70">
                                            <i-input v-model="dataConfig.t1" placeholder="请填写请求域名"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="转发地址" :label-width="70">
                                            <i-input v-model="dataConfig.t2" placeholder="请填写转发地址"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="24">
                                        <form-item label="备注" :label-width="70">
                                            <i-input v-model="dataConfig.t3" class="l-w" type="textarea" :autosize="true" placeholder="请填写备注"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                    </div>
                    <div class="pop-box">
                        <p class="title">功能开关</p>
                        <div class="pop-body">
                            <Row>
                                <i-col span="24">
                                    <FormItem label="启停状态" style="padding:0">
                                        <i-switch v-model="dataConfig.t5" size="large">
                                            <span slot="open">启用</span>
                                            <span slot="close">暂停</span>
                                        </i-switch>
                                        <!-- <RadioGroup v-model="dataConfig.t5">
                                            <Radio label="启用"></Radio>
                                            <Radio label="暂停"></Radio>
                                        </RadioGroup> -->
                                    </FormItem> 
                                </i-col>
                            </Row>
                        </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="forwardConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'ForwardConfig',
    data () {
        return {
            forwardConfig: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: '',
                t3: '',
                t5: true
            }
        }
    },
    methods: {
        openModel(data){
            this.forwardConfig = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped>
 
</style>
