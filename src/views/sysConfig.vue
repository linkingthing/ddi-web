<template>
    <div class="index-main columns t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">服务管理</span>
            <div class="button-box fr"></div>
        </div>
        <div class="index-03 table-box">
            <p class="title">服务配置
                <!-- <a href="" class="more">更多>></a> -->
            </p>
            <div class="index-03-c page-form">
                <i-form 
                :model="dataConfig" 
                label-position="right"
                :label-width="80">
                    <div class="page-group">
                        <Row>
                            <i-col span="8">
                                <form-item label="智能链路" :label-width="100">
                                    <i-switch v-model="dataConfig.t4" size="large">
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
                                            <p>注：开启--递归智能链路查询</p>
                                        </div>
                                    </Poptip>
                                </form-item>
                            </i-col>
                            <i-col span="8">
                                <form-item label="日志记录" :label-width="120">
                                    <i-switch v-model="dataConfig.t1" size="large">
                                      <span slot="open">开启</span>
                                      <span slot="close">关闭</span>
                                    </i-switch>
                                    <!-- <RadioGroup v-model="dataConfig.t1" size="large">
                                        <Radio label="开启">开启</Radio>
                                        <Radio label="关闭">关闭</Radio>
                                    </RadioGroup> -->
                                    <Poptip trigger="hover" placement="right">
                                        <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                        <div slot="content">
                                            <p>注：开启--查询记录的日志</p>
                                        </div>
                                    </Poptip>
                                </form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="8">
                                <form-item label="CNAME同名" :label-width="100">
                                    <i-switch v-model="dataConfig.t3" size="large">
                                      <span slot="open">开启</span>
                                      <span slot="close">关闭</span>
                                    </i-switch>
                                    <!-- <RadioGroup v-model="dataConfig.t3" size="large">
                                        <Radio label="开启">开启</Radio>
                                        <Radio label="关闭">关闭</Radio>
                                    </RadioGroup> -->
                                    <Poptip trigger="hover" placement="right">
                                        <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                        <div slot="content">
                                            <p>注：开启--允许CNAME和A/AAAA记录同名存在</p>
                                        </div>
                                    </Poptip>
                                </form-item>
                            </i-col>
                            <i-col span="8">
                                <form-item label="CNAME优先级" :label-width="120">
                                    <i-switch v-model="dataConfig.t2" size="large">
                                      <span slot="open">开启</span>
                                      <span slot="close">关闭</span>
                                    </i-switch>
                                    <!-- <RadioGroup v-model="dataConfig.t2" size="large">
                                        <Radio label="开启">开启</Radio>
                                        <Radio label="关闭">关闭</Radio>
                                    </RadioGroup> -->
                                    <Poptip trigger="hover" placement="right">
                                        <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                        <div slot="content">
                                            <p>注：开启--CNAME和A/AAAA同名的记录，CNAME优先</p>
                                        </div>
                                    </Poptip>
                                </form-item>
                            </i-col>
                        </Row>
                        <Row>
                            <i-col span="8">
                                <form-item label="TCP查询" :label-width="100">
                                    <i-switch v-model="dataConfig.t5" size="large">
                                      <span slot="open">开启</span>
                                      <span slot="close">关闭</span>
                                    </i-switch>
                                <!-- <RadioGroup v-model="dataConfig.t5" size="large">
                                    <Radio label="开启">开启</Radio>
                                    <Radio label="关闭">关闭</Radio>
                                </RadioGroup> -->
                                </form-item>
                            </i-col>
                            <!-- <i-col span="10">
                                <form-item label="转发dns地址" :label-width="120">
                                    <i-input v-model="dataConfig.t6" placeholder="请填写转发dns地址" class="w210" :disabled="dataConfig.t5==false"></i-input>
                                </form-item>
                            </i-col> -->
                        </Row>
                        <Row>
                            <i-col span="8">
                                <form-item label="服务端口" :label-width="100">
                                    <i-input v-model="dataConfig.t7" placeholder="请填写服务端口"></i-input>
                                </form-item>
                            </i-col>
                        </Row>
                    </div>  
       
                    <p class="title">IPv4服务
                        <!-- <a href="" class="more">更多>></a> -->
                    </p>
                    <div class="page-group">
                        <Row>
                            <i-col span="8">
                                <form-item label="服务状态" :label-width="100">
                                    <i-switch v-model="dataConfig.t8" size="large">
                                      <span slot="open">开启</span>
                                      <span slot="close">关闭</span>
                                    </i-switch>
                                    <!-- <RadioGroup v-model="dataConfig.t8" size="large">
                                        <Radio label="开启">开启</Radio>
                                        <Radio label="关闭">关闭</Radio>
                                    </RadioGroup> -->
                                </form-item>
                            </i-col>
                        </Row>
                        <Row v-show="dataConfig.t8==true">
                            <i-col span="8">
                                <form-item label="服务器IP:" :label-width="100">
                                </form-item>
                            </i-col>
                        </Row>
                        <Row v-for="(list, index) in dataConfig.service" :key="index+'service'"  class="delect-row mb6" v-show="dataConfig.t8==true">
                            <i-col span="8">
                                <form-item label="设备01" :label-width="100">
                                    <i-select v-model="list.service">
                                        <i-option value="主机1">主机1</i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                            <i-col span="8">
                                <form-item label="IP地址" :label-width="100">
                                    <i-select v-model="dataConfig.ip">
                                        <i-option value="192.168.1.1">192.168.1.1</i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                            <div class="btn-delect r325" v-show="index>0">
                                <Icon type="md-trash" />
                            </div> 
                        </Row>
                        <Row v-show="dataConfig.t8==true">
                            <i-col span="24">
                                <a href="javascript:" class="add-config">+新增服务IP</a>
                            </i-col>
                        </Row>
                    </div> 
                     <p class="title">IPv6服务
                        <!-- <a href="" class="more">更多>></a> -->
                    </p>
                    <div class="page-group">
                        <Row>
                            <i-col span="8">
                                <form-item label="服务状态" :label-width="100">
                                    <i-switch v-model="dataConfig.t9" size="large">
                                      <span slot="open">开启</span>
                                      <span slot="close">关闭</span>
                                    </i-switch>
                                    <!-- <RadioGroup v-model="dataConfig.t9" size="large">
                                        <Radio label="开启">开启</Radio>
                                        <Radio label="关闭">关闭</Radio>
                                    </RadioGroup> -->
                                </form-item>
                            </i-col>
                        </Row>
                        <Row v-show="dataConfig.t9==true">
                            <i-col span="8">
                                <form-item label="服务器IP:" :label-width="100">
                                </form-item>
                            </i-col>
                        </Row>
                        <Row v-for="(list, index) in dataConfig.service2" :key="index+'service2'" class="delect-row mb6" v-show="dataConfig.t9==true">
                            <i-col span="8">
                                <form-item label="设备01" :label-width="100">
                                    <i-select v-model="list.service">
                                        <i-option value="主机1">主机1</i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                            <i-col span="8">
                                <form-item label="IP地址" :label-width="100">
                                    <i-select v-model="list.ip">
                                        <i-option value="240::ff::5">240::ff::5</i-option>
                                    </i-select>
                                </form-item>
                            </i-col>
                            <div class="btn-delect r325" v-show="index>0">
                                <Icon type="md-trash" />
                            </div> 
                        </Row>
                        <Row v-show="dataConfig.t9==true">
                            <i-col span="24">
                                <a href="javascript:" class="add-config">+新增服务IP</a>
                            </i-col>
                        </Row>
                    </div> 
                    
                    
                    <i-button type="primary" class="me-button save-btn">保存</i-button>
                </i-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'sysConfig',
    data () {
        return {
            dataConfig: {
                t1: true,
                t2: false,
                t3: false,
                t4: false,
                t5: false,
                t6: '',
                t7: '53',
                t8: false,
                service: [{
                    device: '192.168.1.2',
                    ip: '240::ff::5'
                }],
                t9: false,
                service2: [{
                    device: '192.168.1.2',
                    ip: '240::ff::5'
                }]
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
    .mb6{
        margin-bottom: 6px;
    }
</style>
