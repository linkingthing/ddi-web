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
                                        <form-item label="记录类型" :label-width="80">
                                            <i-select v-model="dataConfig.t1">
                                                <i-option value="A">A-将域名指向一个IPv4地址</i-option>
                                                <i-option value="CNAME">CNAME-将域名指向一个另一个域名</i-option>
                                                <i-option value="AAAA">AAAA-将域名指向一个IPv6地址</i-option>
                                                <i-option value="NS">NS-将子域名指定其他DNS服务器解析</i-option>
                                                <i-option value="MX">MX-将域名指向邮件服务器地址</i-option>
                                                <i-option value="SRV">SRV-记录提供特定的服务的服务器</i-option>
                                                <i-option value="TXT">TXT-文本长度限制512，通常做SPF记录(反垃圾邮件)</i-option>
                                                <!-- <i-option value="CAA">CAA-CA证书颁发机构授权校验</i-option> -->
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="9">
                                        <form-item label="主机记录" :label-width="80">
                                            <i-input v-model="dataConfig.t2" class="w180" placeholder="请填写主机记录">
                                                <span slot="append">.reyzar.com</span>
                                            </i-input>
                                        </form-item>
                                        
                                    </i-col>
                                    <i-col span="3" class="poptip">
                                        <Poptip trigger="hover" placement="right">
                                            <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                            <div slot="content">
                                                <p>主机记录就是域名前缀，常见用法有：</p>
                                                <p>www：解析后的域名为www.reyza.com。</p>
                                                <p>@：直接解析主域名 reyza.com。</p>
                                                <p>*：泛解析，匹配其他所有域名 *.reyza.com。</p>
                                                <p>mail：将域名解析为mail.reyza.com，通常用于解析邮箱服务器。</p>
                                                <p>二级域名：如：abc.reyza.com，填写abc。</p>
                                                <p>手机网站：如：m.reyza.com，填写m。</p>
                                                <p>显性URL：不支持泛解析（泛解析：将所有子域名解析到同一地址）" </p>
                                            </div>
                                        </Poptip>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item label="记录值" :label-width="80">
                                            <i-input v-model="dataConfig.t3" placeholder="请填写记录值"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="9">
                                        <form-item label="解析路线" :label-width="80">
                                            <i-select v-model="dataConfig.t4">
                                                <i-option value="默认">默认</i-option>
                                                <i-option value="电信">电信</i-option>
                                                <i-option value="联通">联通</i-option>
                                                <i-option value="移动">移动</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="3" class="poptip">
                                        <Poptip trigger="hover" placement="right">
                                            <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                            <div slot="content">
                                                <p>如果只有一个IP地址或CNAME域名，请务必选择【默认】。</p>
                                                <p>默认：必填！未匹配到智能解析线路时，返回【默认】线路设置结果。</p>
                                            </div>
                                        </Poptip>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item label="TTL" :label-width="80">
                                            <i-select v-model="dataConfig.t5">
                                                <i-option value="10">10分钟</i-option>
                                                <i-option value="30">30分钟</i-option>
                                                <i-option value="60">1小时</i-option>
                                                <i-option value="60">24小时</i-option>
                                                <i-option value="60">1天</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12" v-show="dataConfig.t1=='MX'">
                                        <form-item label="MX优先级" :label-width="80">
                                            <i-input v-model="dataConfig.t6" placeholder="请填写MX优先级1-50"></i-input>
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
                                        <i-switch v-model="dataConfig.t7" size="large">
                                            <span slot="open">启用</span>
                                            <span slot="close">暂停</span>
                                        </i-switch>
                                        <!-- <RadioGroup v-model="dataConfig.t7">
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
            <i-button class="me-button k-btn" @click="forwardDomainConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'AnalyticalSetupConfig',
    data () {
        return {
            forwardDomainConfig: false,
            dataConfig: {
                title: '',
                t1: 'AAAA',
                t2: '',
                t3: '',
                t4: '默认',
                t5: '10',
                t6: '',
                t7: true
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
