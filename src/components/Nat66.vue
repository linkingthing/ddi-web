<template>
    <modal
        v-model="nat66Modal"
        class-name="pop vertical-center-modal"
        :mask-closable="false"
        width="961"
        :closable="false">
        <div slot="header">{{dataConfig.title}}</div>
        <div>
            <i-form 
                :model="dataConfig" 
                label-position="right"
                :label-width="100">
                <div class="pop-content">
                    <div class="pop-box">
                        <p class="title">配置内容</p>
                            <div class="pop-body">
                                <Row>
                                    <i-col span="12">
                                        <form-item label="内网IPv6前缀">
                                            <i-input v-model="dataConfig.t2" placeholder="请填写内网IPv6前缀"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12" v-if="dataConfig.t22=='有状态前映射'">
                                        <form-item label="内网前缀长度">
                                            <i-input v-model="dataConfig.t2" placeholder="请填写内网前缀长度"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12" v-if="dataConfig.t22=='无状态前映射'">
                                        <form-item label="前缀长度">
                                            <i-input v-model="dataConfig.t2" placeholder="请填写前缀长度"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="外网IPv6前缀">
                                            <i-input v-model="dataConfig.t2" placeholder="请填写外网IPv6前缀"></i-input>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12" v-if="dataConfig.t22=='有状态前映射'">
                                        <form-item 
                                        label="外网前缀长度">
                                            <i-input v-model="dataConfig.t2" placeholder="请填写外网前缀长度"></i-input>
                                        </form-item>
                                    </i-col>
                                </Row>
                                <Row>
                                    <i-col span="12">
                                        <form-item 
                                        label="映射模式">
                                            <i-select v-model="dataConfig.t22">
                                                <i-option value="无状态前映射">无状态前映射</i-option>
                                                <i-option value="有状态前映射">有状态前映射</i-option>
                                            </i-select>
                                        </form-item>
                                    </i-col>
                                    <i-col span="12"></i-col>
                                </Row>
                            </div>
                    </div>
                </div>
            </i-form>
        </div>
        <div slot="footer">
            <i-button class="me-button k-btn" @click="nat66Modal = false">取消</i-button>
            <i-button type="primary" class="me-button add-btn">应用</i-button>
        </div>
    </modal>
</template>

<script>
export default {
    name: 'Nat64',
    data () {
        return {
            nat66Modal: false,
            dataConfig: {
                title: '',
                t1: '',
                t2: '',
                t22: '无状态前映射'
            }
        }
    },
    methods: {
        openModel(data){
            this.nat66Modal = true;
            this.dataConfig.title = data.title;
        }
    }
}
</script>

<style scoped>
 
</style>
