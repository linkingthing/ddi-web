<template>
    <div class="index-main t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <Breadcrumb>
                <router-link to="/space6Layout/appUpgrade">
                    <span class="tit back">
                        <Icon type="ios-arrow-back" size="26"/>
                    </span>
                </router-link>
                <BreadcrumbItem to="/space6Layout/appUpgrade">升级列表</BreadcrumbItem>
                <BreadcrumbItem>IPv6支持度</BreadcrumbItem>
            </Breadcrumb>
            <!-- <span class="tit">IPv6支持度</span>
            <div class="button-box fr"></div> -->
        </div>
        <div class="table-box">
            <div class="table-s">
                <vue-scroll :style="{height:tableHeight+'px'}">
                    <table class="table-default" ref="ele" style="min-width:1822px;">
                        <thead>
                            <tr>
                                <th rowspan="2" width="160">域名</th>
                                <th rowspan="2" width="130">AAAA记录</th>
                                <th rowspan="2" width="150">主页（成功率）</th>
                                <th rowspan="2" width="145">IPv6授权体系</th>
                                <th rowspan="2" width="76">评分</th>
                                <th rowspan="2" width="140">检查时间</th>
                                <th rowspan="2" width="70"></th>

                                <th colspan="3">二级页面/二级URL资源</th>
                                <th colspan="3">三级页面/三级URL资源</th>

                                <th rowspan="2"  colspan="2">操作</th>
                                
                            </tr>
                            <tr>
                                <th width="110">总数</th>
                                <th width="110">外链</th>
                                <th width="195">可访问数</th>

                                <th width="110">总数</th>
                                <th width="110">外链</th>
                                <th width="195">可访问数</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowspan="2">wwww.reyzar.com</td>
                                <td rowspan="2">
                                    <span class="state">支持</span>
                                </td>
                                <td rowspan="2">
                                    <span class="state">100%</span>
                                </td>
                                <td rowspan="2">
                                    <span class="state">支持</span>
                                </td>
                                <td rowspan="2">90</td>
                                <td rowspan="2">2018-12-17 12:18:20</td>
                                <td colspan="1" style="border-bottom: 1px dotted #ddd;">IPv6</td>

                                <td colspan="1" style="border-bottom: 1px dotted #ddd;">807/789</td>
                                <td colspan="1" style="border-bottom: 1px dotted #ddd;">807/789</td>
                                <td colspan="1" style="border-bottom: 1px dotted #ddd;">807(100%)/789(92%)</td>

                                <td colspan="1" style="border-bottom: 1px dotted #ddd;">807/789</td>
                                <td colspan="1" style="border-bottom: 1px dotted #ddd;">807/789</td>
                                <td colspan="1" style="border-bottom: 1px dotted #ddd;">807(100%)/789(92%)</td>

                                <td colspan="1" width="70" style="border-bottom: 1px dotted #ddd;">
                                    <a href="javascript:">明细</a>
                                </td>
                                <td colspan="1" rowspan="2" width="70">
                                    <a href="javascript:">历史</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="border-top: none;">IPv4</td>

                                <td style="border-top: none;">807/789</td>
                                <td style="border-top: none;">807/789</td>
                                <td style="border-top: none;">807(100%)/789(92%)</td>

                                <td style="border-top: none;">807/789</td>
                                <td style="border-top: none;">807/789</td>
                                <td style="border-top: none;">807(100%)/789(92%)</td>

                                <td style="border-top: none;">
                                    <a href="javascript:">明细</a>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                </vue-scroll>
            </div>
            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ipv6Support',
    data () {
        return {
        
        }
    }
}
</script>

<style scoped>
 .table-box table td{
     height: 40px;
 }
</style>
