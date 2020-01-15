<template>
    <modal
        v-model="limitingWebsiteBroadbandConfig"
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
                        <p class="title">带宽内容</p>
                        <div class="pop-body">
                            <Row>
                                <i-col span="12">
                                    <form-item label="域名或IP" :label-width="100">
                                        <i-input v-model="dataConfig.t1" placeholder="请填写域名或IP"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="策略" :label-width="100">
                                        <i-select v-model="dataConfig.t2">
                                            <i-option value="限制最大带宽">限制最大带宽</i-option>
                                            <i-option value="保证最小带宽">保证最小带宽</i-option>
                                        </i-select>
                                    </form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="12">
                                    <form-item label="上行带宽(KB)" :label-width="100">
                                        <i-input v-model="dataConfig.t3" placeholder="请填写上行带宽"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="12">
                                    <form-item label="下行带宽(KB)" :label-width="100">
                                        <i-input v-model="dataConfig.t4" placeholder="请填写下行带宽"></i-input>
                                    </form-item>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="12">
                                    <form-item label="备注" :label-width="100">
                                        <i-input type="textarea" :autosize="true" v-model="dataConfig.t5" placeholder="请填写备注"></i-input>
                                    </form-item>
                                </i-col>
                            </Row>
                        </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="limitingWebsiteBroadbandConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'LimitingWebsiteBroadbandConfig',
    data () {
        return {
            limitingWebsiteBroadbandConfig: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: '限制最大带宽',
                t3: '1024',
                t4: '1024',
                t5: ''
            }
        }
    },
    methods: {
        openModel(data){
            this.limitingWebsiteBroadbandConfig = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped>
 
</style>
