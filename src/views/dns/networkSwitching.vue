<template>
   <div class="index-main networkSwitching" :style="{minHeight:docHeight-200+'px'}">
        <div class="switch-header clearfix">
            <div class="tab fl">
                <Tabs :value="tab" @on-click="goTo"  :animated="false">
                    <tab-pane label="IPv6网络转换列表" name="IPv6网络转换">
                        <div class="table-box">
                            <table class="table-default">
                                <thead>
                                    <tr>
                                        <th width="156">应用域名、IP地址</th>
                                        <th width="170">应用协议</th>
                                        <th width="130">端口</th>
                                        <th width="235">IPv6地址</th>
                                        <th width="175">统计分析</th>
                                        <th width="243">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>ftp.reyzar.com</td>
                                        <td>FTP</td>
                                        <td>21</td>
                                        <td>2001:A:B:C::D</td>
                                        <td>
                                            <a href="javascript:" @click="goAnalysis('并发量')">访发量</a>
                                            &nbsp;&nbsp;
                                            <a href="javascript:" @click="goAnalysis('网络流量')">网络流量</a>
                                        </td>
                                        <td>
                                            <i-button class="k-btn"  @click="goNetWork('edit')">修改</i-button>
                                            <i-button class="k-btn">停用</i-button>
                                            <i-button class="k-btn">删除</i-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
                        </div>
                    </tab-pane>
                    <tab-pane label="NAT64静态映射表" name="NAT64">
                        <div class="table-box">
                            <table class="table-default">
                                <thead>
                                    <tr>
                                        <th width="156">集群</th>
                                        <th width="170">IPv4地址</th>
                                        <th width="130">IPv4端口</th>
                                        <th width="235">IPv6地址</th>
                                        <th width="175">IPv6端口</th>
                                        <th width="243">协议类型</th>
                                        <th width="200">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>nte_G1</td>
                                        <td>12.34.56.78</td>
                                        <td>443</td>
                                        <td>2001:A:B:C::D</td>
                                        <td>443</td>
                                        <td>TCP/UDP</td>
                                        <td>
                                           <i-button class="k-btn"  @click="goNetWork('edit')">修改</i-button> 
                                           <i-button class="k-btn">删除</i-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
                        </div>
                    </tab-pane>
                    <tab-pane label="NAT66映射规则表" name="NAT66">
                        <div class="table-box">
                            <table class="table-default">
                                <thead>
                                    <tr>
                                        <th width="190">映射模式</th>
                                        <th width="218">内网IPv6前缀</th>
                                        <th width="235">前缀长度</th>
                                        <th width="230">外网IPv6前缀</th>
                                        <th width="237">前缀长度</th>
                                        <th width="200">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>无状态前缀映射</td>
                                        <td>FD:A:B::</td>
                                        <td>52/56/60/64/128</td>
                                        <td>2001:C:D::</td>
                                        <td>52/56/60/64/128</td>
                                        <td>
                                           <i-button class="k-btn"  @click="goNetWork('edit')">修改</i-button>
                                           <i-button class="k-btn">删除</i-button> 
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>有状态前缀映射</td>
                                        <td>FD:A:B::</td>
                                        <td>52/56/60/64/128</td>
                                        <td>2001:C:D::</td>
                                        <td>52/56/60/64/128</td>
                                        <td>
                                           <i-button class="k-btn"  @click="goNetWork('edit')">修改</i-button>
                                           <i-button class="k-btn">删除</i-button> 
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
                        </div>
                    </tab-pane>
                    <tab-pane label="组播规则表" name="组播">
                        <div class="table-box">
                            <table class="table-default">
                                <thead>
                                    <tr>
                                        <th width="290">IPv4组播地址</th>
                                        <th width="290">IPv6组播地址</th>
                                        <th width="290">统计分析</th>
                                        <th width="200">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>239.1.2.10</td>
                                        <td>FF12::A::BC</td>
                                        <td>
                                            <a href="javascript:">统计分析</a>
                                        </td>
                                        <td>
                                           <i-button class="k-btn"  @click="goNetWork('edit')">修改</i-button> 
                                           <i-button class="k-btn">删除</i-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
                        </div>
                    </tab-pane>
                </Tabs>
            </div>
            <div class="button-box fr">
                <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goNetWork('add')">新增</i-button>
            </div>
        </div>

        <!-- <network-switch ref="networkSwitchRef"></network-switch> -->
        <nat64 ref="nat64Ref"></nat64>
        <nat66 ref="nat66Ref"></nat66>
        <dslite ref="dsliteRef"></dslite>
        <analysis ref="analysisRef"></analysis>
    </div>
</template>

<script>
// import NetworkSwitch from '@/components/NetworkSwitch';
import Nat64 from '@/components/Nat64';
import Nat66 from '@/components/Nat66';
import Dslite from '@/components/Dslite';
import Analysis from '@/components/Analysis';

export default {
  name: 'networkSwitching',
  data () {
    return {
        tab: this.$route.params.tab
    }
  },
  watch:{
        $route(to,from){
            if(this.$route.params.tab){
                this.tab = this.$route.params.tab
            }
        }
  },
  methods: {
        goTo(name){
            this.$router.push({
                path:'/space6Layout/networkSwitching/'+name
            })
        },
        goNetWork(type){
            if(type == 'add'){
                if(this.tab == 'IPv6网络转换'){
                    this.$refs.networkSwitchRef.openModel({
                        title: '新增网络转换'
                    });
                }else if(this.tab == 'NAT64'){
                    this.$refs.nat64Ref.openModel({
                        title: '新增NAT64静态映射'
                    });
                }else if(this.tab == 'NAT66'){
                    this.$refs.nat66Ref.openModel({
                        title: '新增NAT66静态映射'
                    });
                }else if(this.tab == '组播'){
                    this.$refs.dsliteRef.openModel({
                        title: '新增组播'
                    });
                }
            }else{
                if(this.tab == 'IPv6网络转换'){
                    this.$refs.networkSwitchRef.openModel({
                        title: '修改网络转换'
                    });
                }else if(this.tab == 'NAT64'){
                    this.$refs.nat64Ref.openModel({
                        title: '修改NAT64静态映射'
                    });
                }else if(this.tab == 'NAT66'){
                    this.$refs.nat66Ref.openModel({
                        title: '修改NAT66静态映射'
                    });
                }else if(this.tab == '组播'){
                    this.$refs.dsliteRef.openModel({
                        title: '修改组播'
                    });
                }
            }
        },
        goAnalysis(type){
            let color = 1;
            let data = [];
          
            if(type == '并发量'){
                this.$refs.analysisRef.openModel({
                    title: type
                });
                data = [190, 600, 620, 680, 195, 695];
            }else{
                this.$refs.analysisRef.openModel({
                    title: type + '(MB)'
                });
                color = 0;
                data = [590, 600, 620, 680, 195, 695];
            }

            this.$refs.analysisRef.loadAnalysis(color, data);
        }
  },
  components: {
    //   NetworkSwitch,
      Nat64,
      Nat66,
      Dslite,
      Analysis
  }
}
</script>

<style scoped>

</style>
