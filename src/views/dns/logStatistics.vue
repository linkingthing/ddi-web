<template>
  <div class="index-main t-box" :style="{minHeight:docHeight-200+'px'}">
    <div class="header-title">
      <span class="tit">DDOS防护</span>
      <div class="button-box fr"></div>
    </div>
    <div class="logStatistics">
      <ul class="log-item clearfix" style="display: none">
        <li class="fl">
          <span class="t">当前日志总大小</span>
          <p class="n">84542321</p>
        </li>
        <li class="fl">
          <span class="t">当前日志文件总数</span>
          <p class="n">84542321</p>
        </li>
        <li class="fl">
          <span class="t">当前日志记录总数</span>
          <p class="n">84542321</p>
        </li>
        <li class="fl">
          <span class="t">WebService查询次数</span>
          <p class="n">84542321</p>
          <a href class="details-btn">详情 &gt;</a>
        </li>
      </ul>

      <div class="log-list switch-header">
        <div class="table-box">
          <div class="table-query">
            <i-form :model="searchForm" label-position="right" :label-width="80">
              <Row>
                <i-col span="6">
                  <FormItem label="开始时间" prop="date">
                    <DatePicker
                      type="datetime"
                      :options="startTimeOptions"
                      placeholder="请选择开始时间"
                      :value="searchForm.startTime"
                      ref="producetime"
                      @on-change="showTimePanel('producetime')"
                    ></DatePicker>
                  </FormItem>
                </i-col>
                <i-col span="6">
                  <FormItem label="结束时间" prop="date">
                    <DatePicker
                      type="datetime"
                      :options="endTimeOptions"
                      placeholder="请选择结束时间"
                      v-model="searchForm.endTime"
                      ref="producetime2"
                      @on-change="showTimePanel('producetime2')"
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
                  <i-button
                    class="k-btn success"
                    type="primary"
                    style="margin-left:7px;margin-right:3px"
                  >查询</i-button>
                  <i-button class="k-btn">导出日志</i-button>
                </i-col>
              </Row>
            </i-form>
          </div>
          <div class="table-s">
            <vue-scroll :style="{height:tableHeight+'px'}">
              <table class="table-default" ref="ele" style="width:2625px;">
                <thead>
                  <tr>
                    <th width="135">记录时间</th>
                    <th width="140">应用协议</th>
                    <th width="128">请求域名</th>
                    <th width="100">源IP地址</th>
                    <th width="140">源端口</th>
                    <th width="160">目的IP地址</th>
                    <th width="130">目的端口</th>
                    <th width="130">请求报文</th>
                    <th width="130">响应报文</th>
                    <th width="130">回源源IP地址</th>
                    <th width="130">回源源端口</th>
                    <th width="130">回源目的IP地址</th>
                    <th width="160">回源目的端口</th>
                    <th width="145">请求Referer</th>
                    <th width="145">回源请求报文</th>
                    <th width="145">请求URI</th>
                    <th width="145">处理时间（ms）</th>
                    <th width="145">状态码</th>
                    <th width="145">缓存命中</th>
                    <th width="145">结束时间</th>
                    <th width="145">业务类型</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in list" :key="index">
                    <td>{{item.t1}}</td>
                    <td>{{item.t2}}</td>
                    <td>{{item.t3}}</td>
                    <td>{{item.t4}}</td>
                    <td>{{item.t5}}</td>
                    <td>{{item.t6}}</td>
                    <td>{{item.t7}}</td>
                    <td>{{item.t12}}</td>
                    <td>{{item.t13}}</td>
                    <td>{{item.t8}}</td>
                    <td>{{item.t9}}</td>
                    <td>{{item.t10}}</td>
                    <td>{{item.t11}}</td>
                    <td>{{item.t14}}</td>
                    <td>{{item.t15}}</td>
                    <td>{{item.t16}}</td>
                    <td>{{item.t17}}</td>
                    <td>{{item.t18}}</td>
                    <td>{{item.t19}}</td>
                    <td>{{item.t20}}</td>
                    <td>{{item.t21}}</td>
                  </tr>
                </tbody>
              </table>
            </vue-scroll>
          </div>
          <Page
            show-sizer
            :page-size="20"
            :page-size-opts="[10, 20, 30]"
            :total="100"
            show-total
            show-elevator
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormat } from "@/util/common";

export default {
  name: "logStatistics",
  data() {
    return {
      searchForm: {
        startTime: null,
        endTime: null
      },
      //开始时间操作
      startTimeOptions: {},
      //结束时间操作
      endTimeOptions: {},
      list: [
        {
          t1: "2019/3/13  9:18:26",
          t2: "http",
          t3: "www.reyzar.com",
          t4: "240e:ff:e000::df2:1cf7",
          t5: "2321",
          t6: "240e:ff:e000:4::144",
          t7: "80",
          t8: "10.2.1.144",
          t9: "23456",
          t10: "218.13.22.46",
          t11: "80",
          t12: "12489",
          t13: "231234",
          t14: "http://www.reyzar.com",
          t15: "231204",
          t16: "http://www.reyzar.com/newsdetail/564.html",
          t17: "234",
          t18: "200",
          t19: "TCP_MISS",
          t20: "-",
          t21: "-"
        },
        {
          t1: "2019/3/13  9:18:26",
          t2: "https",
          t3: "oa.reyzar.com",
          t4: "240e:ff:e000::df2:1cf7",
          t5: "4321",
          t6: "240e:ff:e000:4::144",
          t7: "443",
          t8: "10.2.1.144",
          t9: "23456",
          t10: "218.13.22.46",
          t11: "443",
          t12: "12489",
          t13: "231234",
          t14: "-",
          t15: "-",
          t16: "-",
          t17: "-",
          t18: "-",
          t19: "-",
          t20: "2019/3/13  9:23:26",
          t21: "NAT64"
        },
        {
          t1: "2019/3/13  9:18:26",
          t2: "https",
          t3: "oa.reyzar.com",
          t4: "240e:ff:e000::df2:1cf7",
          t5: "4321",
          t6: "240e:ff:e000:4::144",
          t7: "443",
          t8: "10.2.1.144",
          t9: "23456",
          t10: "218.13.22.46",
          t11: "443",
          t12: "12489",
          t13: "231234",
          t14: "https://oa.reyzar.com",
          t15: "231204",
          t16: "http://www.reyzar.com/newsdetail/564.html",
          t17: "234",
          t18: "301",
          t19: "HIT_MISS",
          t20: "-",
          t21: "-"
        },
        {
          t1: "2019/3/13  9:18:26",
          t2: "smtp",
          t3: "smtp.reyzar.com",
          t4: "240e:ff:e000::df2:1cf7",
          t5: "22551",
          t6: "240e:ff:e000:4::144",
          t7: "951",
          t8: "10.2.1.144",
          t9: "23456",
          t10: "218.13.22.46",
          t11: "443",
          t12: "12489",
          t13: "231234",
          t14: "-",
          t15: "-",
          t16: "-",
          t17: "-",
          t18: "-",
          t19: "-",
          t20: "2019/3/13  9:23:26",
          t21: "NAT64"
        }
        // ,{
        //     t1: '2019/03/13 09:18:26',
        //     t2: 'https',
        //     t3: 'www.reyzar.com',
        //     t4: '240e:ff00:e000:aaaa:bbbb:cccc:df20:1cf7',
        //     t5: '65535',
        //     t6: '240e:ff00:e000:aaaa:bbbb:cccc:df20:1cf7	',
        //     t7: '65535',
        //     t8: '6442',
        //     t9: '6442',
        //     t10: '-',
        //     t11: '-',
        //     t12: '-',
        //     t13: '-',
        //     t14: '-',
        //     t15: '-',
        //     t16: '-',
        //     t17: '-',
        //     t18: '-',
        //     t19: '-',
        //     t20: '2019/3/13  9:23:26',
        //     t21: 'NAT64'
        // }
      ]
    };
  },
  mounted() {
    this.searchForm.startTime =
      dateFormat(new Date(), "yyyy-MM-dd") + " 00:00:00";
    this.searchForm.endTime =
      dateFormat(new Date(), "yyyy-MM-dd") + " 23:59:59";
  },
  methods: {
    startTimeChange: function(e) {
      //设置开始时间
      console.log("startTime");
      console.log(this.searchForm.startTime);
      this.searchForm.startTime = e;
      this.endTimeOptions = {
        disabledDate: date => {
          //   disabledDate 是函数，参数为当前的日期，需要返回 Boolean 是否禁用这天。
          let startTime = this.searchForm.startTime
            ? new Date(this.searchForm.startTime).valueOf()
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    endTimeChange: function(e) {
      //设置结束时间
      console.log("endTime");
      console.log(this.searchForm.endTime);
      this.searchForm.endTime = e;
      let endTime = this.searchForm.endTime
        ? new Date(this.searchForm.endTime).valueOf() - 1 * 24 * 60 * 60 * 1000
        : "";
      let endTime2 = this.searchForm.endTime
        ? new Date(this.searchForm.endTime).valueOf() + 7 * 24 * 60 * 60 * 1000
        : "";
      this.startTimeOptions = {
        disabledDate: date => {
          return (
            date && (date.valueOf() > endTime || date.valueOf() > endTime2)
          );
        }
      };
    },
    showTimePanel(refName) {
      /* 此处的onSelectionModeChange方法，就是同点击 选择时间 按钮后触发的方法
          具体此方法的代码逻辑，可以下载组件源码查看*/
      this.$refs[refName].onSelectionModeChange("time");
    }
  }
};
</script>

<style scoped lang="less">
@import "../../assets/less/var";
.log-item {
  padding: 30px;
  li {
    padding: 18px 0 0 28px;
    width: 254px;
    height: 100px;
    margin-left: 30px;
    &:nth-child(1) {
      // background: url("~@/assets/images/bg-01.png") center center no-repeat;
    }
    &:nth-child(2) {
      // background: url("~@/assets/images/bg-02.png") center center no-repeat;
    }
    &:nth-child(3) {
      // background: url("~@/assets/images/bg-03.png") center center no-repeat;
    }
    &:nth-child(4) {
      // background: url("~@/assets/images/bg-04.png") center center no-repeat;
      position: relative;
    }
    &:first-child {
      margin-left: 0;
    }
    .t {
      color: @white;
      font-size: @f14;
    }
    .n {
      color: @white;
      font-size: @f30;
      max-width: 150px;
    }
    .details-btn {
      position: absolute;
      color: #afd1ff;
      font-size: @f14;
      right: 16px;
      bottom: 16px;
      background-color: #1b7cfe;
      padding: 1px 8px;
      border-radius: 23px;
    }
  }
}

.query-box {
  width: 440px;
  padding-right: 30px;
  margin-top: 20px;
  .in_input {
    float: left;
    width: 320px;
  }
  .k-btn {
    margin-left: 10px;
    float: left;
    border: 1px solid @mainColor;
    color: @mainColor;
  }
}

.tab-select {
  padding: 0;
  margin-top: 0;
}
</style>
