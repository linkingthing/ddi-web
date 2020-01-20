<template>
    <div class="index-main t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">网络转换业务统计</span>
            <div class="button-box fr"></div>
        </div>
        <div class="table-box">
            <div class="table-s">
                <table class="table-default">
                    <thead>
                        <tr>
                            <th width="165">域名、IP</th>
                            <th width="160">应用协议</th>
                            <th width="175">当前访问量</th>
                            <th width="265">当前网络流量（请求）</th>
                            <th width="260">当前网络流量（响应）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>域名、IP</td>
                            <td>应用协议</td>
                            <td>当前访问量</td>
                            <td>
                                <span class="state">260MB</span>
                                <a href="javascript:">历史</a>
                            </td>
                            <td>
                                <span class="state">260MB</span>
                                <a href="javascript:">历史</a>
                            </td>
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
    name: 'networkConvertAnalysis',
    data () {
        return {
        
        }
    }
}
</script>

<style scoped>
 
</style>
