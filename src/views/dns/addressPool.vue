<template>
    <div class="index-main t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">地址池列表</span>
            <div class="button-box fr">
                <!-- <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goConfig(0)">新增</i-button> -->
            </div>
        </div>
        <div class="table-box">
            <div class="condition">
                <Form :label-width="80" label-position="left">
                    <Row>
                        <Col span="5">
                            <form-item 
                            label="子网:"
                            :label-width="50"
                            class="mt10">
                                <i-select size="large">
                                    <i-option value="人事部">人事部</i-option>
                                </i-select>
                            </form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <form-item 
                            label="IPv4地址池"
                            :label-width="100"
                            class="mtb">
                            </form-item>
                        </Col>
                        <Col span="12">
                            <form-item 
                            :label-width="100"
                            class="mtb">
                                <i-button type="primary" class="me-button add-btn fr" icon="md-add" @click="goConfig('IPv4新增')">新增</i-button>
                            </form-item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="table-s">
                <table class="table-default">
                    <thead>
                        <tr>
                            <th width="360">起始地址</th>
                            <th width="378">结束地址</th>
                            <th width="370">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>192.168.0.1</td>
                            <td>192.168.0.100</td>
                            <td>
                                <i-button class="k-btn" @click="goConfig('IPv4修改')">修改</i-button>
                                <i-button class="k-btn" @click="delect">删除</i-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" class="mb10" :total="100" show-total show-elevator/>

            <div class="condition">
                <Form :label-width="80" label-position="left">
                    <Row>
                        <Col span="12">
                            <form-item 
                            label="IPv6地址池"
                            :label-width="100"
                            class="mtb">
                            </form-item>
                        </Col>
                        <Col span="12">
                            <form-item 
                            :label-width="100"
                            class="mtb">
                                <i-button type="primary" class="me-button add-btn fr" icon="md-add" @click="goConfig('IPv6新增')">新增</i-button>
                            </form-item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div class="table-s">
                <table class="table-default">
                    <thead>
                        <tr>
                            <th width="360">起始地址</th>
                            <th width="378">结束地址</th>
                            <th width="370">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>240c:ff::2</td>
                            <td>240c:ff::100</td>
                            <td>
                                <i-button class="k-btn" @click="goConfig('IPv6修改')">修改</i-button>
                                <i-button class="k-btn" @click="delect">删除</i-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
        <!-- <address-pool-config ref="configRef"></address-pool-config> -->
    </div>
</template>

<script>

export default {
    name: 'addressPool',
    data () {
        return {
        
        }
    },
    methods: {
        goConfig(type){
            this.$refs.configRef.openModel({
                title: type
            });
        },
        delect(){
            this.$Modal.confirm({
                title: '提示',
                content: '确定删除？',
                onOk: () => {
                    this.$Message.success('删除成功');
                }
            })
        }
    },
    // components: {
    //     AddressPoolConfig
    // }
}
</script>

<style lang="less">
 .condition{
     text-align: left;
     .ivu-form-item-label{
         font-size: 14px;
     }
 }
</style>
<style lang="less" scoped>
.mtb{
    margin-top: 3px;
    margin-bottom: 5px;
 }
 .mb10{
     margin-bottom: 10px;
 }
 .add-btn{
     margin-right: 0;
     margin-bottom: 0;
 }
</style>

