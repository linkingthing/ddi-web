<template>
    <div class="index-main clusterMg t-box" :style="{minHeight:docHeight-200+'px'}">
        <div class="header-title">
            <span class="tit">系统日志</span>
            <div class="button-box fr">
                <!-- <i-button type="primary" class="me-button add-btn" icon="md-add" @click="goAdjunction(0)">新增</i-button> -->
            </div>
        </div>
        <div class="table-box">
            <div class="table-query">
                <i-form 
                    :model="searchForm" 
                    label-position="right"
                    :label-width="80">
                        <Row>
                            <i-col span="6">
                                <FormItem label="开始时间" prop="date">
                                    <DatePicker
                                    type="datetime"
                                    :options='startTimeOptions'
                                    placeholder="请选择开始时间"
                                    :value="searchForm.startTime"
                                    ref="producetime" @on-change="showTimePanel('producetime')"
                                    ></DatePicker>
                                </FormItem>
                            </i-col>
                            <i-col span="6">
                                <FormItem label="结束时间" prop="date">
                                    <DatePicker
                                    type="datetime"
                                    :options = 'endTimeOptions'
                                    placeholder="请选择结束时间"
                                    :value="searchForm.endTime"
                                    ref="producetime2" @on-change="showTimePanel('producetime2')"
                                    ></DatePicker>
                                </FormItem>
                            </i-col>
                            <i-col span="4">
                                <FormItem label="请求域名">
                                    <i-input placeholder="请填写请求域名"></i-input>
                                </FormItem>
                            </i-col>
                            <i-col span="4">
                                <FormItem label="客户端IP">
                                    <i-input placeholder="请填写客户端IP"></i-input>
                                </FormItem>
                            </i-col>
                            <i-col span="4">
                                <i-button class="k-btn success" type="primary" style="margin-left:7px;margin-right:3px">查询</i-button>
                                <i-button class="k-btn">导出日志</i-button>
                            </i-col>
                        </Row>
        
                    </i-form>
            </div>
            <div class="table-s">
                <table class="table-default">
                    <thead>
                        <tr>
                            <th width="140">时间</th>
                            <th width="170">设备/集群</th>
                            <th width="160">类别</th>
                            <th width="160">操作员</th>
                            <th width="240">操作</th>
                            <th width="255">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>20190517111430</td>
                            <td>ate1</td>
                            <td>修改配置</td>
                            <td>admin</td>
                            <td>增加配置</td>
                            <td>增加www.reyzar.com网站升级</td>
                        </tr>
                    </tbody>
                </table>
                <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
            </div>
        </div>
    </div>
</template>

<script>
import {dateFormat} from '../util/common'

export default {
    name: 'SysLog',
    data () {
        return {
            searchForm: {
                startTime: null,
                endTime: null
            },
            //开始时间操作
            startTimeOptions:{},
            //结束时间操作
            endTimeOptions:{},
        }
    },
    methods: {
        startTimeChange:function(e){
          //设置开始时间
          console.log("startTime");
          console.log(this.searchForm.startTime);
          this.searchForm.startTime = e;
          this.endTimeOptions = {
              disabledDate:date =>{
                //   disabledDate 是函数，参数为当前的日期，需要返回 Boolean 是否禁用这天。
                  let startTime = this. searchForm.startTime ? new Date(this.searchForm.startTime).valueOf()  : '';
                  return date && (date.valueOf() < startTime)
              }
          }
      },
      endTimeChange:function(e){
          //设置结束时间
          console.log("endTime");
          console.log(this.searchForm.endTime);
          this.searchForm.endTime = e;
          let endTime = this.searchForm.endTime  ? new Date( this.searchForm.endTime ).valueOf()-1*24*60*60*1000 :'';
          let endTime2 = this.searchForm.endTime  ? new Date( this.searchForm.endTime ).valueOf()+7*24*60*60*1000 :'';
          this.startTimeOptions = {
              disabledDate:date =>{
                  return date && (date.valueOf() >endTime || date.valueOf() >endTime2)
              }
          }
        },
        showTimePanel(refName){
            /* 此处的onSelectionModeChange方法，就是同点击 选择时间 按钮后触发的方法
          具体此方法的代码逻辑，可以下载组件源码查看*/
            this.$refs[refName].onSelectionModeChange('time');
        }
    },
    mounted () {
        this.searchForm.startTime = dateFormat(new Date(), 'yyyy-MM-dd') + ' 00:00:00';
        this.searchForm.endTime = dateFormat(new Date(), 'yyyy-MM-dd') + ' 23:59:59';
    }
}
</script>

<style scoped>

</style>
