<template>
    <modal
        v-model="colony"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="961"
        :closable="false">
        <div slot="header">
            {{dataConfig.title}}
            <span>(当前步骤:{{step}}/2)</span>
        </div>
        <div>
            <vue-scroll style="height: 500px;" ref="vs">
                <i-form 
                :model="dataConfig" 
                label-position="right"
                :label-width="122"
                :rules="ruleValidate"
                ref="formValidate">
                    <div class="pop-content">
                        <div class="pop-box" v-show="step==1">
                            <p class="title">集群设置</p>
                                <div class="pop-body" style="padding-bottom:0">
                                    <Row>
                                        <i-col span="10">
                                            <form-item label="集群域" prop="t1">
                                                <i-input v-model="dataConfig.t1" placeholder="请填写集群域"></i-input>
                                            </form-item>
                                        </i-col>
                                        <i-col span="2" class="poptip">
                                            <Poptip trigger="hover" placement="right">
                                                <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                                <div slot="content">
                                                    <p>集群唯一性标识,集群内节点通过该标识识别数据包是否来自集群</p>
                                                </div>
                                            </Poptip>
                                        </i-col>
                                        <i-col span="10">
                                            <form-item label="IPv4组播地址" prop="t2">
                                                <i-input v-model="dataConfig.t2" placeholder="请填写IPv4组播地址"></i-input>
                                            </form-item>
                                        </i-col>
                                        <i-col span="2" class="poptip">
                                            <Poptip trigger="hover" placement="left">
                                                <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                                <div slot="content">
                                                    <p>集群内节点之间通讯的IPv4广播地址</p>
                                                </div>
                                            </Poptip>
                                        </i-col>
                                    </Row>
                                    <Row>
                                        <i-col span="12">
                                            <form-item 
                                            label="集群类型" prop="colonyType">
                                                <i-select v-model="dataConfig.colonyType">
                                                    <i-option value="6ATE">6ATE</i-option>
                                                    <i-option value="6NTE">6NTE</i-option>
                                                    <i-option value="6EAG">6EAG</i-option>
                                                </i-select>
                                            </form-item>
                                        </i-col>
                                        <i-col span="10">
                                            <form-item label="IPv6组播地址" prop="t4">
                                                <i-input v-model="dataConfig.t4" placeholder="请填写IPv6组播地址"></i-input>
                                            </form-item>
                                        </i-col>
                                        <i-col span="2" class="poptip">
                                            <Poptip trigger="hover" placement="left">
                                                <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                                <div slot="content">
                                                    <p>集群内节点之间通讯的IPv6广播地址</p>
                                                </div>
                                            </Poptip>
                                        </i-col>
                                    </Row>
                                    <Row>
                                        <i-col span="10">
                                            <form-item label="心跳时间(秒)" prop="t5">
                                                <i-input v-model="dataConfig.t5" placeholder="请填写心跳时间"></i-input>
                                            </form-item>
                                        </i-col>
                                        <i-col span="2" class="poptip">
                                            <Poptip trigger="hover" placement="right">
                                                <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                                <div slot="content">
                                                    <p>心跳包的发送时间间隔</p>
                                                </div>
                                            </Poptip>
                                        </i-col>
                                        <i-col span="10">
                                            <form-item label="宕机时间(秒)" prop="t6">
                                                <i-input v-model="dataConfig.t6" placeholder="请填写宕机时间"></i-input>
                                            </form-item>
                                        </i-col>
                                        <i-col span="2" class="poptip">
                                            <Poptip trigger="hover" placement="left">
                                                <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                                <div slot="content">
                                                    <p>判断集群内节点是否失去心跳的时间间隔</p>
                                                </div>
                                            </Poptip>
                                        </i-col>
                                    </Row>
                                    <Row>
                                        <i-col span="12">
                                            <form-item 
                                            label="设备列表" prop="t7">
                                                <i-select v-model="dataConfig.t7" :label-width="100" multiple >
                                                    <i-option value="ate_1">ate_1</i-option>
                                                    <i-option value="ate_2">ate_2</i-option>
                                                </i-select>
                                            </form-item>
                                        </i-col>
                                        <i-col span="12">
                                            <form-item label="负载策略" prop="t8">
                                                <i-select v-model="dataConfig.t8">
                                                    <i-option value="哈希">哈希</i-option>
                                                    <i-option value="轮询">轮询</i-option>
                                                    <i-option value="本地处理">本地处理</i-option>
                                                </i-select>
                                            </form-item>
                                        </i-col>
                                    </Row>
                                    <!-- ipv6 -->
                                    <Row>
                                        <i-col span="1">
                                            <form-item label="IPv6地址池" class="tit"></form-item>
                                        </i-col>
                                        <i-col span="2" class="poptip">
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <Poptip trigger="hover" placement="right">
                                                <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                                <div slot="content">
                                                    <p>IPv6全球单播地址,如：</p>
                                                    <p>起始地址:240e:ff:e000:4::144,结束地址:240e:ff:e000:4::144表示单个离散地址</p>
                                                    <p>起始地址:240e:ff:e000:4::100,结束地址:240e:ff:e000:4::1FF表示一段连续地址</p>
                                                </div>
                                            </Poptip>
                                        </i-col>
                                    </Row>

                                    <Row class="delect-row" v-for="(list, index) in dataConfig.ip6List" :key="index+'ipv6'">
                                        <i-col span="12">
                                            <form-item :label="'起始地址'+(index+1)"
                                            :prop="'ip6List.' + index + '.x1'"
                                            :rules="{required: true, message: '请输起始地址', trigger: 'blur', pattern:/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/}">
                                                <i-input v-model="list.x1" placeholder="请输起始地址,如:240e:ff:e000:4::1/64"></i-input>
                                            </form-item>
                                        </i-col>
                                        <i-col span="12">
                                            <form-item :label="'结束地址'+(index+1)"
                                            :prop="'ip6List.' + index + '.x2'"
                                            :rules="{required: true, message: '请输结束地址', trigger: 'blur', pattern:/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/}">
                                                <i-input v-model="list.x2" placeholder="请输结束地址,如:240e:ff:e000:4::ffff/64"></i-input>
                                            </form-item>
                                        </i-col>
                                        <div class="btn-delect" v-show="index>0" @click="delectIPv6Adr(index)">
                                            <Icon type="md-trash" />
                                        </div>
                                    </Row>
                                    <Row>
                                        <i-col span="24">
                                            <a href="javascript:" class="add-config"  @click="addIPv6Adr()">+添加配置</a>
                                        </i-col>
                                    </Row>

                                    <Row>
                                        <i-col span="1">
                                            <form-item label="IPv4地址池" class="tit"></form-item>
                                        </i-col>
                                        <i-col span="2" class="poptip">
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <Poptip trigger="hover" placement="right">
                                                <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                                <div slot="content">
                                                    <p>非公网地址，需要在网关做NAT转发,多地址用逗号分隔,如：</p>
                                                    <p>起始地址:218.13.22.46,结束地址:218.13.22.46表示单个离散地址</p>
                                                    <p>起始地址:218.13.22.1,结束地址:218.13.22.254表示一段连续地址</p>
                                                </div>
                                            </Poptip>
                                        </i-col>
                                    </Row>

                                    <Row class="delect-row" v-for="(list, index) in dataConfig.ip4List" :key="index+'ipv4'">
                                        <i-col span="12">
                                            <form-item :label="'起始地址'+(index+1)"
                                            :prop="'ip4List.' + index + '.x1'"
                                            :rules="{message: '请输起始地址', trigger: 'blur', pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/}">
                                                <i-input v-model="list.x1" placeholder="请输起始地址,如:192.168.1.10/24"></i-input>
                                            </form-item>
                                        </i-col>
                                        <i-col span="12">
                                            <form-item :label="'结束地址'+(index+1)"
                                            :prop="'ip4List.' + index + '.x2'"
                                            :rules="{message: '请输结束地址', trigger: 'blur', pattern:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/}">
                                                <i-input v-model="list.x2" placeholder="请输结束地址,如:192.168.1.254/24"></i-input>
                                            </form-item>
                                        </i-col>
                                        <div class="btn-delect" v-show="index>0" @click="delectIPv4Adr(index)">
                                            <Icon type="md-trash" />
                                        </div>
                                    </Row>
                                    <Row>
                                        <i-col span="24">
                                            <a href="javascript:" class="add-config" @click="addIPv4Adr">+添加配置</a>
                                        </i-col>
                                    </Row>
                                    
                                </div>
                        </div>
                        
                        <div class="pop-box" v-show="(dataConfig.colonyType=='6ATE'||dataConfig.colonyType=='6EAG'||dataConfig.colonyType=='6CAE') && step==2">
                            <p class="title">应用层转换设置</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="请求头via设置"
                                        prop="t11">
                                            <i-input v-model="dataConfig.t11" placeholder="请填写请求头via设置"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="4">
                                        <form-item 
                                        label="XFF开关"
                                        prop="t12">
                                            <i-switch v-model="dataConfig.t12" size="large">
                                                <span slot="open">开启</span>
                                                <span slot="close">关闭</span>
                                            </i-switch>
         
                                        </form-item>
                                    </i-col>
                                    <i-col span="3" class="poptip">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <Poptip trigger="hover" placement="top">
                                            <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                            <div slot="content">
                                                <p>是否设置X-Forward-For请求头</p>
                                            </div>
                                        </Poptip>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="响应头via设置"
                                        prop="t13">
                                            <i-input v-model="dataConfig.t13" placeholder="请填写响应头via设置"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12"></i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item label="防盗链设置" :label-width="200" class="tit"></form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="4">
                                        <form-item 
                                        label="referer开关"
                                        prop="t9">
                                            <i-switch v-model="dataConfig.t9" size="large">
                                                <span slot="open">开启</span>
                                                <span slot="close">关闭</span>
                                            </i-switch>
                                        </form-item>
                                    </i-col>
                                    <i-col span="3" class="poptip">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <Poptip trigger="hover" placement="top">
                                            <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                            <div slot="content">
                                                <p>检查http请求头Referer</p>
                                            </div>
                                        </Poptip>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="redirect开关"
                                        prop="t10">
                                            <i-switch v-model="dataConfig.t10" size="large">
                                                <span slot="open">开启</span>
                                                <span slot="close">关闭</span>
                                            </i-switch>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                        <div class="pop-box" v-show="(dataConfig.colonyType=='6ATE'||dataConfig.colonyType=='6EAG'||dataConfig.colonyType=='6CAE') && step==2">
                            <p class="title">应用缓存设置</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="缓存开关"
                                        prop="t14">
                                            <i-switch v-model="dataConfig.t14" size="large">
                                                <span slot="open">开启</span>
                                                <span slot="close">关闭</span>
                                            </i-switch>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="Cookie缓存"
                                        prop="t15">
                                            <i-switch v-model="dataConfig.t15" size="large">
                                                <span slot="open">开启</span>
                                                <span slot="close">关闭</span>
                                            </i-switch>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="10">
                                        <form-item 
                                        label="内存缓存(M)"
                                        prop="t16">
                                            <i-input v-model="dataConfig.t16" placeholder="请填写内存缓存"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="2" class="poptip">
                                        <Poptip trigger="hover" placement="top">
                                            <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                            <div slot="content">
                                                <p>网站升级的内存缓存大小，如500 表示500MB-1表示系统默认</p>
                                            </div>
                                        </Poptip>
                                    </i-col>
                                    <i-col span="10">
                                        <form-item 
                                        label="磁盘缓存(M)"
                                        prop="t17">
                                            <i-input v-model="dataConfig.t17" placeholder="请填写磁盘缓存"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="2" class="poptip">
                                        <Poptip trigger="hover" placement="left">
                                            <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                            <div slot="content">
                                                <p>网站升级硬盘缓存大小，如：1024 表示1G，默认 1G</p>
                                            </div>
                                        </Poptip>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="10">
                                        <form-item 
                                        label="缓存目录"
                                        prop="t18">
                                            <i-input v-model="dataConfig.t18" placeholder="请填写缓存目录"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="2" class="poptip">
                                        <Poptip trigger="hover" placement="right">
                                            <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                            <div slot="content">
                                                <p>选择磁盘缓存存放的目录</p>
                                            </div>
                                        </Poptip>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="更新策略"
                                        prop="t19">
                                            <i-select v-model="dataConfig.t19">
                                                <i-option value="更新策略">更新策略</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                        <div class="pop-box" v-show="(dataConfig.colonyType=='6ATE'||dataConfig.colonyType=='6EAG'||dataConfig.colonyType=='6CAE') && step==2">
                            <p class="title">日志设置</p>
                            <div class="pop-body" style="padding-bottom:0">
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="日志开关"
                                        prop="t20">
                                            <i-switch v-model="dataConfig.t20" size="large">
                                                <span slot="open">开启</span>
                                                <span slot="close">关闭</span>
                                            </i-switch>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="单设备容量(GB)"
                                        prop="t21">
                                            <i-input v-model="dataConfig.t21" placeholder="请填写单设备容量"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="DEBUG开关"
                                        prop="t22">
                                            <i-switch v-model="dataConfig.t22" size="large">
                                                <span slot="open">开启</span>
                                                <span slot="close">关闭</span>
                                            </i-switch>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="DEBUG类型"
                                        :class="{disColor:dataConfig.t22==false}"
                                        prop="t23">
                                            <i-input v-model="dataConfig.t23" placeholder="DEBUG类型" :disabled="dataConfig.t22==false"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="日志服务器"
                                        prop="t24">
                                            <i-input v-model="dataConfig.t24" placeholder="请填写日志服务器"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="日志端口"
                                        prop="t25">
                                            <i-input v-model="dataConfig.t25" placeholder="请填写日志端口"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                        </div>
                        <div class="pop-box" v-show="(dataConfig.colonyType=='6NTE') && step==2">
                            <p class="title">NAT64</p>
                            <div class="pop-body" style="padding-bottom:0">
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="NAT64 IPv4 Pool"
                                        :label-width="200" class="tit"></form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="起始地址"
                                        prop="t26">
                                            <i-input v-model="dataConfig.t26" placeholder="请填写起始地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="结束地址"
                                        prop="t27">
                                            <i-input v-model="dataConfig.t27" placeholder="请填写结束地址"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="IPv6 Prefix"
                                        prop="t28">
                                            <i-input v-model="dataConfig.t28" placeholder="请填写IPv6 Prefix"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="每用户MSQ"
                                        prop="t29">
                                            <i-input v-model="dataConfig.t29" placeholder="每IPv6用户运行最大会话数"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>

                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="NAT回话超时"
                                        :label-width="200" class="tit"></form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="UDP(分钟)"
                                        prop="t30">
                                            <i-input v-model="dataConfig.t30" placeholder="请填写UDP"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="TCP SYNC(秒)"
                                        prop="t31">
                                            <i-input v-model="dataConfig.t31" placeholder="请填写TCP SYNC"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="ICMP(分钟)"
                                        prop="t32">
                                            <i-input v-model="dataConfig.t32" placeholder="请填写ICMP"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="TCP CLOSE(秒)"
                                        prop="t33">
                                            <i-input v-model="dataConfig.t33" placeholder="请填写TCP CLOSE"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="快速DNS回话"
                                        prop="t34">
                                            <i-select v-model="dataConfig.t34">
                                                <i-option value="5">5分钟</i-option>
                                                <i-option value="10">10分钟</i-option>
                                                <i-option value="15">15分钟</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="TCP TRANS(小时)"
                                        prop="t35">
                                            <i-input v-model="dataConfig.t35" placeholder="请填写TCP TRANS"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                
                            </div>
                        </div>
                        <div class="pop-box" v-show="(dataConfig.colonyType=='6NTE') && step==2">
                            <p class="title">DS-Lite</p>
                            <div class="pop-body" style="padding-bottom:0">
                                <Row>
                                    <i-col span="10">
                                        <form-item 
                                        label="AFTR地址"
                                        prop="t36">
                                            <i-input v-model="dataConfig.t36" placeholder="可添加多个地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="2" class="poptip">
                                        <Poptip trigger="hover" placement="right">
                                            <Icon type="ios-help-circle-outline" class="tips" size="20"/>
                                            <div slot="content">
                                                <p>可添加多个,请用“,”分号分割。</p>
                                            </div>
                                        </Poptip>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="B4总数量"
                                        prop="t37">
                                            <i-input v-model="dataConfig.t37" placeholder="请填写B4总数量"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="B4MSQ"
                                        prop="t38">
                                            <i-input v-model="dataConfig.t38" placeholder="请填写B4MSQ"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12"></i-col>
                                </Row>
                                <Row>
                                    <i-col span="24">
                                        <form-item 
                                        label="IPv4地址池"
                                        :label-width="200" class="tit"></form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="起始地址"
                                        prop="t39">
                                            <i-input v-model="dataConfig.t39" placeholder="请填写起始地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="结束地址"
                                        prop="t40">
                                            <i-input v-model="dataConfig.t40" placeholder="请填写结束地址"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                            </div>
                        </div>

                        <div class="pop-box" v-show="(dataConfig.colonyType=='6ATE') && step==3">
                            <p class="title">网络层转换设置</p>
                            <div class="pop-body" style="padding-bottom:0;">
                                <Row>
                                    <i-col span="12">
                                        <form-item label="IPv4地址池" :label-width="200"  class="tit"></form-item>
                                    </i-col>
                                </Row>
                                <Row class="delect-row">
                                    <i-col span="12">
                                        <form-item label="起始地址">
                                            <i-input placeholder="请填写起始地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="结束地址">
                                            <i-input placeholder="请填写结束地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <div class="btn-delect r70">
                                        <Icon type="md-trash" />
                                    </div>
                                </Row>
                                <Row  v-show="(dataConfig.colonyType=='6ATE') && step==3">
                                    <i-col span="24">
                                        <a href="javascript:" class="add-config">+添加配置</a>
                                    </i-col>
                                </Row>

                                <Row>
                                    <i-col span="12">
                                        <form-item label="IPv6地址池" :label-width="200"></form-item>
                                    </i-col>
                                </Row>
                                <Row class="delect-row">
                                    <i-col span="12">
                                        <form-item label="起始地址">
                                            <i-input placeholder="请填写起始地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item label="结束地址">
                                            <i-input placeholder="请填写结束地址"></i-input>
                                        </form-item>
                                    </i-col>
                                    <div class="btn-delect">
                                        <Icon type="md-trash" />
                                    </div>
                                </Row>
                            </div>
                        </div>
                        <!-- <Row  v-show="(dataConfig.colonyType=='6ATE') && step==3">
                            <i-col span="24">
                                <a href="javascript:" class="add-config">+添加配置</a>
                            </i-col>
                        </Row> -->
                        <Row style="margin-top: 20px;">
                            <i-col span="24" v-if="(dataConfig.colonyType=='6ATE') && step==1">
                                <form-item label="最大会话数" prop="t41">
                                    <i-input v-model="dataConfig.t41" placeholder="请输入最大会话数" class="l-w"></i-input>
                                </form-item>
                            </i-col>
                        </Row>

                        <!-- <div class="pop-box" v-show="step==3">
                            <p class="title">告警设置</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="24">
                                        <form-item 
                                        label="告警阀值"></form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="CPU(%)"
                                        prop="t41">
                                            <i-input v-model="dataConfig.t41" placeholder="请填写CPU"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="网络流量(%)" :label-width="116"
                                        prop="t42">
                                            <i-input v-model="dataConfig.t42" placeholder="请填写网络流量"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="存储(%)"
                                        prop="t43">
                                            <i-input v-model="dataConfig.t43" placeholder="请填写存储"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="告警频率(分钟)" :label-width="116" prop="t44">
                                            <i-select v-model="dataConfig.t44">
                                                <i-option value="5">5分钟</i-option>
                                                <i-option value="10">10分钟</i-option>
                                                <i-option value="15">15分钟</i-option>
                                                <i-option value="30">30分钟</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="内存(%)"
                                        prop="t45">
                                            <i-input v-model="dataConfig.t45" placeholder="请填写内存"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12"></i-col>
                                </Row>

                                <Row>
                                    <i-col span="24">
                                        <form-item 
                                        label="业务监控"></form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="监控频率(分钟)"
                                        :label-width="116"
                                        prop="t52">
                                            <i-select v-model="dataConfig.t52">
                                                <i-option value="5">5分钟</i-option>
                                                <i-option value="10">10分钟</i-option>
                                                <i-option value="15">15分钟</i-option>
                                                <i-option value="30">30分钟</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="告警级别"
                                        prop="t53">
                                            <i-select v-model="dataConfig.t53">
                                                <i-option value="信息">信息</i-option>
                                                <i-option value="告警">告警</i-option>
                                                <i-option value="错误">错误</i-option>
                                                <i-option value="严重">严重</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                </Row>
                                
                                <Row>
                                    <i-col span="24">
                                        <form-item 
                                        label="告警配置"></form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="告警方式"
                                        prop="alarm">
                                            <i-select v-model="dataConfig.alarm">
                                                <i-option value="wx">企业微信</i-option>
                                                <i-option value="email">邮箱</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12" v-show="dataConfig.alarm=='wx'">
                                        <form-item 
                                        label="CorpID"
                                        prop="t54">
                                            <i-input v-model="dataConfig.t54" placeholder="请填写CorpID"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12" v-show="dataConfig.alarm=='email'">
                                        <form-item 
                                        label="邮箱地址"
                                        prop="t55">
                                            <i-input v-model="dataConfig.t55" placeholder="请填写邮箱地址"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row v-show="dataConfig.alarm=='wx'">
                                    <i-col span="12">
                                        <form-item 
                                        label="Secret"
                                        prop="t56">
                                            <i-input v-model="dataConfig.t56" placeholder="请填写Secret"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12">
                                        <form-item 
                                        label="应用ID"
                                        prop="t57">
                                            <i-input v-model="dataConfig.t57" placeholder="请填写应用ID"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                
                            </div>
                        </div> -->
                    </div>
                </i-form>
            </vue-scroll>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="colony = false">取消</i-button>
            <i-button class="me-button k-btn" v-show="step!=1" @click="prve">上一步</i-button>
            <i-button type="primary" class="me-button add-btn" v-show="step!=2"  @click="next">下一步</i-button>
            <i-button type="primary" class="me-button add-btn" @click="handleSubmit" v-show="step==2">应用</i-button>
        </div>
    </modal>
</template>

<script>
import {isEmpty, isChinese, isNumber, isIPv4} from '../util/common'

export default {
    name: 'Colony',
    data () {
        // 集群域名
        const validator1 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入集群域名'));
            }else if(isChinese(value)){
                callback(new Error('集群域名不能输入中文'));
            }else {
                callback();
            }
        };
        // 内存缓存
        const validator2 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入内存缓存'));
            }else if(!isNumber(value)){
                callback(new Error('请输入数值'));
            }else if(isNumber(value) && value<-1){
                callback(new Error('请正确输入数值'));
            }else {
                callback();
            }
        };
        // 磁盘缓存
        const validator3 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入磁盘缓存'));
            }else if(!isNumber(value)){
                callback(new Error('请输入数值'));
            }else if(isNumber(value) && value<0){
                callback(new Error('数值不能小于0'));
            }else {
                callback();
            }
        };
        // 单设备容量
        const validator4 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入单设备容量'));
            }else if(!isNumber(value)){
                callback(new Error('请输入数值'));
            }else if(isNumber(value) && value<0){
                callback(new Error('数值不能小于0'));
            }else {
                callback();
            }
        };
        // 日志端口
        const validator5 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入日志端口'));
            }else if(!isNumber(value)){
                callback(new Error('请输入日志端口'));
            }else {
                callback();
            }
        };
        // 起始地址
        const validator6 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输起始地址'));
            }else if(!isIPv4(value)){
                callback(new Error('请输起始地址'));
            }else {
                callback();
            }
        };
        // 结束地址
        const validator7 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输结束地址'));
            }else if(!isIPv4(value)){
                callback(new Error('请输结束地址'));
            }else {
                callback();
            }
        };
         // UDP
        const validator8 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入UDP'));
            }else if(!isNumber(value)){
                callback(new Error('请输入UDP'));
            }else {
                callback();
            }
        };
         // TCP SYNC
        const validator9 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入TCP SYNC'));
            }else if(!isNumber(value)){
                callback(new Error('请输入TCP SYNC'));
            }else {
                callback();
            }
        };
         // ICMP
        const validator10 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入ICMP'));
            }else if(!isNumber(value)){
                callback(new Error('请输入ICMP'));
            }else {
                callback();
            }
        };
         // TCP CLOSE
        const validator11 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入TCP CLOSE'));
            }else if(!isNumber(value)){
                callback(new Error('请输入TCP CLOSE'));
            }else {
                callback();
            }
        };
        // TCP TRANS
        const validator12 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入TCP TRANS'));
            }else if(!isNumber(value)){
                callback(new Error('请输入TCP TRANS'));
            }else {
                callback();
            }
        };
        // B4总数量
        const validator13 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入B4总数量'));
            }else if(!isNumber(value)){
                callback(new Error('请输入B4总数量'));
            }else {
                callback();
            }
        };
        // B4MSQ
        const validator14 = (rule, value, callback) => {
            if (!isEmpty(value)) {
                callback(new Error('请输入B4MSQ'));
            }else if(!isNumber(value)){
                callback(new Error('请输入B4MSQ'));
            }else {
                callback();
            }
        };
        
        return {
            colony: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: '239.0.0.1',
                colonyType: '6ATE',//集群类型
                t4: 'FF12::1',
                t5: '3',
                t6: '9',
                t7: [],
                t8: '本地处理',
                t9: true,
                t10: true,
                t11: '',
                t12: true,
                t13: '',
                t14: true,
                t15: true,
                t16: '-1',
                t17: '1024',
                t18: 'var/log',
                t19: '0',
                t20: true,
                t21: '500',
                t22: false,
                t23: '',
                t24: '127.0.0.1',
                t25: '514',
                t26: '',
                t27: '',
                t28: '',
                t29: '1000',
                t30: '5',
                t31: '2',
                t32: '1',
                t33: '2',
                t34: '5',
                t35: '2',
                t36: '',
                t37: '3800',
                t38: '200',
                t39: '',
                t40: '',
                t41: '10000000',
                ip4List: [{
                    x1: '',
                    x2: ''
                }],
                ip6List: [{
                    x1: '',
                    x2: ''
                }]
            },
            // 表单验证规则
            ruleValidate: {
                t1: [{ required: true, validator: validator1, trigger: 'blur' }],
                t2: [{ required: true, message: '请输入IPv4组播地址', trigger: 'blur' }],
                colonyType: [{ message: '请选择集群类型', trigger: 'change' }],
                t4: [{ required: true, message: '请输入IPv6组播地址', trigger: 'blur' }],
                t5: [{ required: true, message: '请输入心跳时间', trigger: 'blur', pattern:/^[1-9]\d*$/ }],
                t6: [{ required: true, message: '请输入宕机时间', trigger: 'blur', pattern:/^[1-9]\d*$/ }],
                t8: [{ message: '请选择负载策略', trigger: 'change' }],
                t11: [{ message: '请输入请求头via设置', trigger: 'blur' }],
                t13: [{ message: '请输入响应头via设置', trigger: 'blur' }],

                t16: [{ required: true, validator: validator2, trigger: 'blur' }],
                t17: [{ required: true, validator: validator3, trigger: 'blur' }],
                t18: [{ required: true, message: '请选择缓存目录', trigger: 'change' }],
                t19: [{ required: true, message: '请选择更新策略', trigger: 'change' }],

                t21: [{ required: true, validator: validator4, trigger: 'change' }],
                t24: [{ required: true, message: '请输入日志服务器', trigger: 'change' }],
                t25: [{ required: true, validator: validator5, trigger: 'change' }],

                t26: [{ required: true, validator: validator6, trigger: 'blur' }],
                t27: [{ required: true, validator: validator7, trigger: 'blur' }],
                t28: [{ required: true, message: '请输入IPv6 Prefix', trigger: 'blur' }],
                t29: [{ required: true, message: '请输入每用户MSQ', trigger: 'blur' }],

                t30: [{ required: true, validator: validator8, trigger: 'blur' }],
                t31: [{ required: true, validator: validator9, trigger: 'blur' }],
                t32: [{ required: true, validator: validator10, trigger: 'blur' }],
                t33: [{ required: true, validator: validator11, trigger: 'blur' }],
                t34: [{ required: true, message: '请选择快速DNS回话', trigger: 'change' }],
                t35: [{ required: true, validator: validator12, trigger: 'blur' }],

                t36: [{ required: true, message: '请输入AFTR地址', trigger: 'blur' }],
                t37: [{ required: true, validator: validator13, trigger: 'blur' }],
                t38: [{ required: true, validator: validator14, trigger: 'blur' }],
                t39: [{ required: true, message: '请输入起始地址', trigger: 'blur' }],
                t40: [{ required: true, message: '请输入结束地址', trigger: 'blur' }]
            },
            step: 1
        }
    },
    methods: {
        openModel(data){
            this.colony = true;
            this.dataConfig.title = data.title;
        },
        // 添加ipv4业务地址
        addIPv4Adr(){
            let cf = {
                x1: '',
                x2: ''
            }
            this.dataConfig.ip4List.push(cf);
        },
        // 删除ipv4业务地址
        delectIPv4Adr(index){
            this.dataConfig.ip4List.splice(index, 1);
        },
        // 添加ipv6业务地址
        addIPv6Adr(){
            let cf = {
                x1: '',
                x2: ''
            }
            this.dataConfig.ip6List.push(cf);
        },
        // 删除ipv6业务地址
        delectIPv6Adr(index){
            this.dataConfig.ip6List.splice(index, 1);
        },
        // 应用
        handleSubmit(){
            let canNext = true;
            let colonyType = this.dataConfig.colonyType

            if(colonyType == '6ATE' || colonyType == '6EAG'){

                this.$refs.formValidate.validateField('t16',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t17',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t18',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t19',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t21',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t24',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t25',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });

            }else if(colonyType == '6NTE'){
                this.$refs.formValidate.validateField('t26',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t27',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t28',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t29',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t30',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t31',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t32',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t33',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t34',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t35',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t36',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t37',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t38',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t39',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
                this.$refs.formValidate.validateField('t40',function(msg){
                    if(msg){
                        canNext = false;
                    }
                });
            }

            if(canNext){
                this.$Message.success('成功!');
            }else{
                this.$Message.error('错误!');
            }

            
        },
        next(){
            let canNext = true;
            // 校验字段
            let colonyType = this.dataConfig.colonyType
            if(colonyType == '6ATE' || colonyType == '6NTE' || colonyType == '6EAG'){

                this.$refs.formValidate.validateField('t1',function(msg){
                    if(msg){
                        canNext = false;
                    }
                })
                this.$refs.formValidate.validateField('t2',function(msg){
                    if(msg){
                        canNext = false;
                    }
                })
                this.$refs.formValidate.validateField('t4',function(msg){
                    if(msg){
                        canNext = false;
                    }
                })
                this.$refs.formValidate.validateField('t5',function(msg){
                    if(msg){
                        canNext = false;
                    }
                })
                this.$refs.formValidate.validateField('t6',function(msg){
                    if(msg){
                        canNext = false;
                    }
                })

                for(let i=0;i<this.dataConfig.ip6List.length;i++){
                    this.$refs.formValidate.validateField('ip6List.' + i + '.x1',function(msg){
                        if(msg){
                            canNext = false;
                        }
                    })
                }
                for(let i=0;i<this.dataConfig.ip6List.length;i++){
                    this.$refs.formValidate.validateField('ip6List.' + i + '.x2',function(msg){
                        if(msg){
                            canNext = false;
                        }
                    })
                }
                // this.$refs.formValidate.validateField((valid) => {
                //     if (valid) {
                //         this.$Message.success('成功!');
                //     } else {
                //         this.$Message.error('错误');
                //     }
                // })
            }


            if(!canNext){
                return;
            }


            this.step++;
        
            this.$refs['vs'].scrollTo({
                y: '0'
            },0);
        },
        prve(){
            this.step--;
        
            this.$refs['vs'].scrollTo({
                y: '0'
            },0);
        }
    }
}
</script>

<style scoped lang="less">

</style>
