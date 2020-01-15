<template>
    <modal
        v-model="eviceModal"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="500"
        :closable="false">
        <div slot="header">修改访问控制表</div>
        <div>
            <vue-scroll style="height: 500px;" ref="vs">
                <i-form 
                    :model="dataConfig" 
                    label-position="right"
                    :label-width="80"
                    :rules="ruleValidate"
                    ref="formValidate">
                    <div class="pop-content">
                        <div class="pop-box">
                                <div class="pop-body">
                                    <Row>
                                        <i-col span="18">
                                            <form-item label="名称" prop="name">
                                                <i-input  v-model="dataConfig.name" placeholder="请填访问控制名称"></i-input>
                                            </form-item>
                                        </i-col>
                                    </Row>
                                </div>
                        </div>
                        
                        <div class="pop-box" style="margin-top:-50px;">
                            <div class="pop-body">
                                 <Form ref="dataConfig" :model="dataConfig" :label-width="80" style="width: 300px">
                                    <FormItem
                                            v-for="(item, index) in dataConfig.exception"
                                            :key="index"
                                            :label="'IP列表' + item.index"
                                            :prop="'exception.' + index + '.value'"
                                            :rules="{required: true, message: 'IP列表 ' + item.index +'不能为空', trigger: 'blur'}">
                                               <Row>
                                                <!-- IP列表 -->
                                                <Col span="18">
                                                    <Input type="text" v-model="item.value" placeholder="请输入IP地址"></Input>
                                                </Col>
                                                <!-- 删除 -->
                                                <Col span="4" offset="1">
                                                    <Button @click="handleRemove(index)"> 
                                                    <Icon type="md-trash" /></Button>
                                                </Col>
                                            </Row>
                                    </FormItem>
                                </Form>
                        
                                <Row>
                                    <i-col span="24">
                                        <a href="javascript:" class="add-config" @click="handleAdd">+添加IP地址</a>
                                    </i-col>
                                </Row>
                            </div>
                        </div>


                    </div>
                </i-form>
            </vue-scroll>
            
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="eviceModal = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
        </div>
    </modal>
</template>

<script>
import axios from "axios"
import {isURL, isNumber, isEmpty} from '../util/common'
export default {
    name: 'EviceStatisticsConfig',
    data () {
        // 校验配置组名
        const validator1 = (rule, value, callback) => {
            var name = /^[a-zA-Z0-9_]{1,}$/; 
            if(!isEmpty(value)){
                callback(new Error('请输入控制表名(字母和数字)'));
            }else{
                if (!value.match(name)) {
                    callback(new Error('请正确输入控制表名(字母和数字)'));
                }else {
                    if(isNumber(value.substr(0,1))){
                        callback(new Error('控制表名不能以数字开头'));
                    }
                    callback();
                }
            }
        };
        return {
            value:"",
            IP:[],
            id:'',
            // name:'',
            index: 1,
            eviceModal: false,
            // 表单数据
            dataConfig: {
                title: '',
                name: '', 
                // 例外规则
                exception: [{
                       value: '',
                       index: 1,
                       status: 1
                }],
            },
            loading: false,
            // 表单验证规则
            ruleValidate: {
                name: [{ required: true, validator: validator1, trigger: 'blur' }],
            }
        }
    },
    methods: {
        openConfig(data){ 
            this.eviceModal = true;
            this.id=data.data
         
         },
 
        // 确定
        handleSubmit(){
            this.$refs.formValidate.validate((valid) => {
                 if (valid) {
                        this.getModify();
                        this.$Message.success('修改成功!');
                        this.cancelModel();
                        this.getManger();
                    } else {
                        this.$Message.error('修改失败!');
                    }
            })
        },
           //  修改
     getModify(){
        for(var key in this.dataConfig.exception){
            this.value=this.dataConfig.exception[key].value
            this.IP.push(this.value)
        }
        this.$axios.put('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/acls/'+this.id,{
           name: this.dataConfig.name,
           IP: this.IP,
        })
        .then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
     },
    //    添加IP地址
        handleAdd () {
            this.index++;
            this.dataConfig.exception.push({
                    value: '',
                    index: this.index,
                    status: 1
            });
        },
        handleRemove (index) {
             this.dataConfig.exception.splice(index, 1);
        },
        //关闭弹窗
        cancelModel() {
            this.eviceModal = false
            this.$refs.formValidate.resetFields()
        },
    }
}
</script>

<style scoped>
 .ivu-divider-dashed {
    /* background: 0 0; */
    border-top: 0px dashed #e8eaec;
}

.ivu-col-span-4 >.ivu-btn{
  padding:0px 0px;
  border:0px solid transparent; 
  margin-left:100px;
  color:#4796FF;
}

</style>
