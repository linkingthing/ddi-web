<template>
    <modal
        v-model="linkPortConfig"
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
                                        <form-item label="DNS主机" :label-width="80">
                                            <i-select v-model="dataConfig.t1">
                                                <i-option value="192.168.1.1">192.168.1.1</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="网卡IP" :label-width="60">
                                            <i-select v-model="dataConfig.t2">
                                                <i-option value="192.168.1.100">192.168.1.100</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item label="链路名称" :label-width="80">
                                            <i-select v-model="dataConfig.t3">
                                                <i-option value="默认">默认</i-option>
                                                <i-option value="电信">电信</i-option>
                                                <i-option value="联通">联通</i-option>
                                                <i-option value="移动">移动</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="IP类型" :label-width="60">
                                            <i-select v-model="dataConfig.t4">
                                                <i-option value="IP4">IP4</i-option>
                                                <i-option value="IP6">IP6</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="8">
                                        <form-item label="权重" :label-width="80">
                                            <i-input v-model="dataConfig.t5" placeholder="请填权重值(1~255)数值越小权重越高"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="3" class="poptip">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <Poptip trigger="hover" placement="right">
                                            <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                            <div slot="content">
                                                <p>请输入权重值(1~255)数值越小权重越高</p>
                                            </div>
                                        </Poptip>
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
                                        <i-switch v-model="dataConfig.t6" size="large">
                                            <span slot="open">开启</span>
                                            <span slot="close">关闭</span>
                                        </i-switch>
                                        <!-- <RadioGroup v-model="dataConfig.t6">
                                            <Radio label="开启"></Radio>
                                            <Radio label="关闭"></Radio>
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
            <i-button class="me-button k-btn" @click="linkPortConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'LinkPortConfig',
    data () {
        return {
            linkPortConfig: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: '',
                t3: '默认',
                t4: 'IP6',
                t5: '',
                t6: true
            }
        }
    },
    methods: {
        openModel(data){
            this.linkPortConfig = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped>
 
</style>
