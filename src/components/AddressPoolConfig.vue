<template>
    <modal
        v-model="addressPoolConfig"
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
                        <p class="title">内容信息</p>
                        <div class="pop-body">
                            <Row>
                                <i-col span="12" v-show="dataConfig.title=='IPv4新增' || dataConfig.title=='IPv4修改'">
                                    <form-item label="起始地址" :label-width="70">
                                        <i-input v-model="dataConfig.t1" placeholder="请填写起始地址"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="12" v-show="dataConfig.title=='IPv4新增' || dataConfig.title=='IPv4修改'">
                                    <form-item label="起始地址" :label-width="70">
                                        <i-input v-model="dataConfig.t1" placeholder="请填写起始地址"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="12" v-show="dataConfig.title=='IPv6新增' || dataConfig.title=='IPv6修改'">
                                    <form-item label="结束地址" :label-width="70">
                                        <i-input v-model="dataConfig.t2" placeholder="请填写结束地址"></i-input>
                                    </form-item>
                                </i-col>
                                <i-col span="12" v-show="dataConfig.title=='IPv6新增' || dataConfig.title=='IPv6修改'">
                                    <form-item label="结束地址" :label-width="70">
                                        <i-input v-model="dataConfig.t2" placeholder="请填写结束地址"></i-input>
                                    </form-item>
                                </i-col>
                            </Row>
                        </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="addressPoolConfig = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'AddressPoolConfig',
    data () {
        return {
            addressPoolConfig: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: ''
            }
        }
    },
    methods: {
        openModel(data){
            this.addressPoolConfig = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped>
 
</style>
