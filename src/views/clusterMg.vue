<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">集群管理</span>
            <div class="button-box fr">
                <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goColony('add')">新增</i-button>
            </div>
        </div>
        <div class="table-box">
            <div class="table-s">
                <table class="table-default">
                    <thead>
                        <tr>
                            <th width="120">集群组</th>
                            <th width="120">状态</th>
                            <th width="115">设备数量</th>
                            <th width="185">IPv6地址使用量</th>
                            <th width="180">IPv4地址使用量</th>
                            <th width="220">负载策略</th>
                            <th width="170">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ate_G1</td>
                            <td>
                                <span class="state">正常</span>
                            </td>
                            <td>5</td>
                            <td>50</td>
                            <td>10</td>
                            <td>本地处理</td>
                            <td>
                                <i-button class="k-btn" @click="goColony('edit')">修改</i-button>
                                <i-button class="k-btn">删除</i-button>
                            </td>
                        </tr>
                        <tr>
                            <td>ate_G2</td>
                            <td>
                                <span class="state err">异常</span>
                            </td>
                            <td>2</td>
                            <td>23</td>
                            <td>5</td>
                            <td>哈希</td>
                            <td>
                                <i-button class="k-btn" @click="goColony('edit')">修改</i-button>
                                <i-button class="k-btn">删除</i-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>

        <colony ref="colonyRef"></colony>
    </div>
</template>

<script>
import Colony from '../components/Colony';

export default {
    name: 'clusterMg',
    data () {
        return {
        
        }
    },
    methods: {
        goColony(type){
            var title = '新增集群';
            if(type == 'edit'){
                title = '修改集群'
            }
            this.$refs.colonyRef.openModel({
                title
            });
            
        }
    },
    components: {
        Colony
    }
}
</script>

<style scoped>

</style>
