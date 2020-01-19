<template>
    <modal
        v-model="blacklistModal"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
         width="500"
        :closable="false">
        <div slot="header">修改访问控制列表</div>
        <div>
            <vue-scroll style="height: 500px;"  ref="vs">
                <i-form 
                    :model="dataConfig" 
                    label-position="right"
                    :label-width="80"
                    ref="formValidate">
                    <div class="pop-content">
                        <div class="pop-box">
                                <div class="pop-body">
                                    <form-item 
                                            label="新建访问控制列表"
                                            prop="name"
                                            :label-width="137">
                                            <i-select v-model="dataConfig.id">
                                                <i-option v-for="item in select" :key="item.id" :value="item.id">{{item.name}}</i-option>
                                            </i-select>
                                    </form-item>
                                </div>
                        </div>
                        
                    </div>
                </i-form>
            </vue-scroll>
            
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="blacklistModal = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn" @click="handleSubmit">确定</i-button>
        </div>
    </modal>
</template>

<script>
import {isURL, isNumber, isEmpty} from '../util/common'
export default {
    name: 'BlacklistConfig',
    data () {
        return {
            blacklistModal: false,
            self:'',
            id:'',
            select:[],
            aclid:'',
            // 表单数据
            dataConfig: {
                name: '',
            },
            loading: false,

        }
    },
    mounted () {
      this.getSelct();   
    },
    methods: {
        openModel(data){
        this.id=data
        console.log(this.id);
        console.log(11111111111);
        
         this.blacklistModal = true;
         },
         getSelct(){
            this.$axios.get('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/acls',{
         })
        .then(res=>{
           this.select=res.data.data
        }).catch(err=>{
           console.log(err)
        })
         },
        //修改
        Modify(){
            this.$axios.put('http://10.0.0.19:8081/apis/linkingthing.com/example/v1/ipblackholes/'+this.id,{
               aclid: this.dataConfig.id,
        })
        .then(res=>{
            console.log(res);
        }).catch(err=>{
           console.log(err)
        })
        },
        // 确定
        handleSubmit(){
        this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.Modify()
                    this.$Message.success('修改成功!');
                    this.cancelModel();
                } else {
                    this.$Message.error('修改失败!');
                }
        })
        },
        //关闭弹窗
        cancelModel() {
            this.deviceModal = false
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