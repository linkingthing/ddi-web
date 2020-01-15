<template>
    <modal
        v-model="parameterSetConfig"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="530"
        :closable="false">
        <div slot="header">{{dataConfig.title}}</div>
        <div>
            <i-form 
            :model="dataConfig" 
            label-position="right"
            :label-width="80">
                <div class="pop-content">
                    <div class="pop-box">
                        <p class="title">资源类型</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="资源类型名称" :label-width="100">
                                            <i-input v-model="dataConfig.t1" placeholder="请填写资源类型名称"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="parameterSetConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'ParameterSetConfig',
    data () {
        return {
            parameterSetConfig: false,
            dataConfig: {
                title: '',
                t1: ''
            }
        }
    },
    methods: {
        openModel(data){
            this.parameterSetConfig = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped lang="less">
 .pop-body{
     padding-bottom: 0;
 }
</style>
