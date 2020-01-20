<template>
    <div class="index-main t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">NAT66统计分析</span>
            <div class="button-box fr"></div>
        </div>
        <div class="table-box">
            <div class="table-s">
                <table class="table-default">
                    <thead>
                        <tr>
                            <th width="345">源IPv6前缀</th>
                            <th width="335">目的IPv6前缀</th>
                            <th width="340">网络流量</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>源IPv6前缀</td>
                            <td>目的IPv6前缀</td>
                            <td>网络流量</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'nat66Analysis',
    data () {
        return {
        
        }
    }
}
</script>

<style scoped>
 
</style>
