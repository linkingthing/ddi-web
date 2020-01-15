<template>
    <modal
        v-model="blacklistConfig"
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
                                        <form-item label="IP地址">
                                            <i-input v-model="dataConfig.t1" placeholder="请填写IP地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="掩码/前缀">
                                            <i-select v-model="dataConfig.t2">
                                                <i-option value="32">32</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item label="IP类型">
                                            <i-select v-model="dataConfig.t3">
                                                <i-option value="IP4">IP4</i-option>
                                                <i-option value="IP6">IP6</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="备注">
                                            <i-input v-model="dataConfig.t4" type="textarea" :autosize="true" placeholder="请填写备注"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                    </div>
                    <div class="pop-box">
                        <p class="title">功能设置</p>
                        <div class="pop-body">
                            <Row>
                                <i-col span="24">
                                    <FormItem label="状态" style="padding:0">
                                        <i-switch v-model="dataConfig.t5" size="large">
                                            <span slot="open">启用</span>
                                            <span slot="close">暂停</span>
                                        </i-switch>
                                        <!-- <RadioGroup v-model="dataConfig.t5">
                                            <Radio label="启用"></Radio>
                                            <Radio label="停用"></Radio>
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
            <i-button class="me-button k-btn" @click="blacklistConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'BlacklistConfig',
    data () {
        return {
            blacklistConfig: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: '',
                t3: 'IP6',
                t4: '',
                t5: true
            }
        }
    },
    methods: {
        openModel(data){
            this.blacklistConfig = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped>
 
</style>