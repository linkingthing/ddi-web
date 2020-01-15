<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">递归解析</span>
            <div class="button-box fr"></div>
        </div>
        <div class="index-03 table-box">
            <p class="title">解析控制
                <!-- <a href="" class="more">更多>></a> -->
            </p>
            <div class="index-03-c page-form">
                <i-form 
                :model="dataConfig" 
                label-position="right"
                :label-width="80">
                    <Row>
                        <i-col span="8">
                            <form-item label="递归查询" :label-width="120">
                                <i-switch v-model="dataConfig.t2" size="large">
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                                <!-- <RadioGroup v-model="dataConfig.t2" size="large">
                                    <Radio label="开启">开启</Radio>
                                    <Radio label="关闭">关闭</Radio>
                                </RadioGroup> -->
                            </form-item>
                        </i-col>
                    </Row>
                    <Row>
                        <i-col span="8">
                            <form-item label="DNS64转换" :label-width="120" :class="{disColor:dataConfig.t2==false}">
                                <i-switch v-model="dataConfig.t3" size="large" :disabled="dataConfig.t2==false">
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                               <!-- <RadioGroup v-model="dataConfig.t3" size="large">
                                    <Radio label="开启">开启</Radio>
                                    <Radio label="关闭">关闭</Radio>
                                </RadioGroup> -->
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="合成IPv6地址优先" :label-width="130" :class="{disColor:dataConfig.t3==false}">
                                <i-switch v-model="dataConfig.t4" size="large"  :disabled="dataConfig.t3==false">
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                                <!-- <RadioGroup v-model="dataConfig.t4" size="large">
                                    <Radio label="开启">开启</Radio>
                                    <Radio label="关闭">关闭</Radio>
                                </RadioGroup> -->
                                <Poptip trigger="hover" placement="right">
                                    <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                    <div slot="content">
                                        <p>注：开启--合成和原有的AAAA记录，合成的优先</p>
                                    </div>
                                </Poptip>
                            </form-item>
                        </i-col>
                        <i-col span="8">
                            <form-item label="合成IPv6地址前缀" :label-width="130" :class="{disColor:dataConfig.t3==false}">
                                <i-input v-model="dataConfig.t5" placeholder="2401:ff9b::/96" :disabled="dataConfig.t3==false"></i-input>
                            </form-item>
                        </i-col>
                    </Row>
                    <i-button type="primary" class="me-button save-btn">保存</i-button>
                </i-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'recursionAnalysis',
    data () {
        return {
            dataConfig: {
                // t1: '开启',
                t2: false,
                t3: false,
                t4: false,
                t5: ''
            }
        }
    },
    mounted () {
        
    }
}
</script>

<style scoped>
    .index-03{
        padding: 20px 30px;
        margin-top: 0;
    }
</style>
