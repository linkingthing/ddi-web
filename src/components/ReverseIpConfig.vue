<template>
    <modal
        v-model="reverseIpConfig"
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
                                        <form-item label="IP">
                                            <i-input v-model="dataConfig.t1" placeholder="请填写IP"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="记录类型">
                                            <i-select v-model="dataConfig.t2">
                                                <i-option value="A">A-将域名指向一个IPv4地址</i-option>
                                                <i-option value="AAAA">AAAA-将域名指向一个IPv6地址</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item label="域名">
                                            <i-input v-model="dataConfig.t3" placeholder="请填写域名"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="TTL">
                                            <i-select v-model="dataConfig.t4">
                                                <i-option value="10">10分钟</i-option>
                                                <i-option value="30">30分钟</i-option>
                                                <i-option value="60">1小时</i-option>
                                                <i-option value="60">24小时</i-option>
                                                <i-option value="60">1天</i-option>
                                            </i-select>
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
                                            <span slot="close">停用</span>
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
            <i-button class="me-button k-btn" @click="reverseIpConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'ReverseIpConfig',
    data () {
        return {
            reverseIpConfig: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: 'A',
                t3: '',
                t4: '10',
                t5: true
            }
        }
    },
    methods: {
        openModel(data){
            this.reverseIpConfig = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped>
 
</style>
