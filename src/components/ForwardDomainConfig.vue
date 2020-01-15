<template>
    <modal
        v-model="forwardDomainConfig"
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
                                        <form-item label="域名" :label-width="40">
                                            <i-input v-model="dataConfig.t1" placeholder="请填写新增的域名"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="备注" :label-width="40">
                                            <i-input v-model="dataConfig.t2" type="textarea" :autosize="true" placeholder="请填写备注"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="forwardDomainConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'ForwardDomainConfig',
    data () {
        return {
            forwardDomainConfig: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: ''
            }
        }
    },
    methods: {
        openModel(data){
            this.forwardDomainConfig = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped>
 
</style>
