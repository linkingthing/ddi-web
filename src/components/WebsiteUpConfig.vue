<template>
    <modal
    v-model="configModal"
    class-name="pop vertical-center-modal"
    :mask-closable="false"
    width="500"
    :closable="false">
    <div slot="header">新建资源记录</div>
    <div>
        <vue-scroll style="height: 500px;" ref="vs">
            <i-form 
            :model="upgradeConfig" 
            label-position="right"
            :label-width="500"
            :rules="ruleValidate"
            ref="formValidate">
                <div class="pop-content">
                    <div class="pop-box">
                        <!-- <p class="title">应用域名</p> -->
                        <div class="pop-body" style="padding-bottom:0">
                            <form-item 
                                label="名称"
                                :label-width="110"
                                prop="t1">
                                <i-input v-model="upgradeConfig.t1" placeholder="请填写资源名称"></i-input>
                            </form-item>
                            <form-item 
                                   label="类型"
                                    prop="t2"
                                    :label-width="110">
                                    <i-select v-model="upgradeConfig.t2">
                                        <i-option value="A">A</i-option>
                                        <i-option value="AAAA">AAAA</i-option>
                                        <i-option value="CNAME">CNAME</i-option>
                                        <i-option value="MX">MX</i-option>
                                        <i-option value="NS">NS</i-option>
                                        <i-option value="NAPTR">NAPTR</i-option>
                                        <i-option value="PTR">PTR</i-option>
                                        <i-option value="SRV">SRV</i-option>
                                        <i-option value="TXT">TXT</i-option>
                                        <i-option value="URL">URL</i-option>
                                    </i-select>
                             </form-item>
                            <form-item 
                                label="记录值"
                                :label-width="110"
                                prop="t3">
                                <i-input v-model="upgradeConfig.t3" placeholder="请填写记录值"></i-input><span>s</span>
                            </form-item>
                            <form-item 
                                label="TTL" 
                                 prop="t4"
                                :label-width="110">
                                <i-input type="text" v-model="upgradeConfig.t4" placeholder="请输入延缓时间" number></i-input> 
                            </form-item> 
                            <FormItem label="是否启用" prop="name"  :label-width="110">
                                <RadioGroup v-model="upgradeConfig.isused">
                                    <Radio label=1 isused="1">是</Radio>
                                    <Radio label=0 isused="0">否</Radio>
                                </RadioGroup>
                            </FormItem>       
                        </div>
                    </div>
           
                </div>
            </i-form>
        </vue-scroll>
    </div>
    <div slot="footer">
        <i-button class="me-button k-btn" @click="configModal = false">取消</i-button>
        <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
    </div> 
</modal>
</template>

<script>
import axios from "axios"
import {isURL, isIPv4, isIPv6, isEmpty} from '../util/common'

export default {
    name: 'WebsiteUpConfig',
    data () {
        // 校验域名/IP
        const validateDmainIp = (rule, value, callback) => {
            if(!isEmpty(value)){
                callback('请输入记录值');
            }else{
                if (!isURL(value)) {
                    callback(new Error('请正确输入记录值'));
                }else {
                    callback();
                }
            }
        };

        const validateDmainIp4 = (rule, value, callback) => {
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    callback();
                }
        };

        return {
            // 是否显示mode
            configModal: false,
            // 表单数据
            upgradeConfig: {
                title: '',
                t1: '',
                t2: 'A',
                t3: '',
                t4: '',
                isused:''
            },
            self:'',
            id:'',
            fileSSL: null,
            fileSSL2: null,
            // 表单验证规则
            ruleValidate: {
                t1: [{ required: true, message: '请填写资源名称', trigger: 'change' }],
                t2: [{ message: '请选择资源类型', trigger: 'change' }],
                t3: [{ required: true, validator: validateDmainIp, trigger: 'blur'}],
                t4: [{ validator: validateDmainIp4, trigger: 'blur'}],
            }
        }
    },
    methods: {
        openConfig(self,id){
         this.self=self;
         this.id=id;
         this.configModal = true;
        setTimeout(()=>{
                this.$refs['vs'].scrollTo({
                    y: '0'
                },0);
            },0)
            
        },
    update(){
            this.$axios.post('http://10.0.0.19:8081'+this.self+'/'+this.id+'/rrs',{
               name: this.upgradeConfig.t1,
               type: this.upgradeConfig.t2,
               value: this.upgradeConfig.t3,
               ttl: this.upgradeConfig.t4,
               isused: this.upgradeConfig.isused,
        })
        .then(res=>{
            console.log(res)
        }).catch(err=>{
           console.log(err)
        })
        },
        // 应用
        handleSubmit(){
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.update();
                    this.$Message.success('新建成功!');
                   this.getResources();
                } else {
                    this.$Message.error('新建失败');
                }
            })
        },
     },
}
</script>

<style scoped>
</style>
