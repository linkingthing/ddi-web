<template>
  <div class="ip-manage-table-chart">
    <div class="table-chart-content">
      <template v-if="list.length">
        <div class="table-chart-list">
          <div 
            v-for="(item, idx) in list"
            :key="idx"
            class="item-square"
            :class="{
              'is-unused':item.AddressType === statusList.unused,
              'is-dynamic':item.AddressType === statusList.dynamic,
              'is-collision':item.AddressType === statusList.collision,
              'is-reserved':item.AddressType === statusList.reserved,
              'is-manual':item.AddressType === statusList.manual,
              'is-stable':item.AddressType === statusList.stable,
              'is-lease':item.AddressType === statusList.lease,
              'is-dead':item.AddressType === statusList.dead,
              'is-selected':item.selected
            }"
            :title="item.ip"
            @click="handleSelect(item)"
          />
        </div>
        <div class="ip-range">当前IP段{{`${startIp}~${endIp}`}}</div>

        <div class="item-title">IP地址：{{selectedItem.ip}}</div>

        <div class="selected-content">
          <div class="selected-content-title">地址静态信息</div>
          <div class="selected-content-row">MAC地址：<span>{{ selectedItem.macaddress }}</span></div>
          <div class="selected-content-row">MAC厂商：<span>{{ selectedItem.macvender }}</span></div>
          <div class="selected-content-row">活跃时间：<span>{{ selectedItem.leaseendtime }}</span></div>
          <div class="selected-content-row">类型：<span>{{ selectedItem.typeText }}</span></div>
          <!-- <div class="selected-content-row">地址池：<span>{{ selectedItem. }}</span></div>
          <div class="selected-content-row">租约状态：<span>{{ selectedItem. }}</span></div> -->
          <div class="selected-content-row">网口接口号：<span>{{ selectedItem.interfaceid }}</span></div>
        </div>

        <div class="selected-content">
          <div class="selected-content-title">地址动态信息</div>
          <div class="selected-content-row">探测时间：<span>{{ selectedItem.leasestarttime }}</span></div>
          <div class="selected-content-row">MAC地址：<span>{{ selectedItem.macaddress }}</span></div>
          <div class="selected-content-row">MAC厂商：<span>{{ selectedItem.macvender }}</span></div>
          <div class="selected-content-row">NetBIOS名称：<span>{{ selectedItem.netbiosname }}</span></div>
          <div class="selected-content-row">操作系统：<span>{{ selectedItem.opersystem }}</span></div>
          <div class="selected-content-row">扫描接口号：<span>{{ selectedItem.scaninterfaceid }}</span></div>
          <div class="selected-content-row">指纹：<span>{{ selectedItem.fingerprint }}</span></div>
        </div>
      </template>
      <div v-else class="no-data">暂无数据</div>
    </div>

    <div class="table-chart-legend">
      <div class="legend-title">地址类别</div>
      <div class="legend-list">
        <div 
          v-for="item in legendList"
          :key="item.label"
          class="legend-list-item"
        >
          <div 
            class="item-square"          
            :class="{
              'is-unused':item.unused,
              'is-dynamic':item.dynamic,
              'is-collision':item.collision,
              'is-reserved':item.reserved,
              'is-manual':item.manual,
              'is-stable':item.stable,
              'is-lease':item.lease,
              'is-dead':item.dead,
              'is-selected':item.selected
            }" 
          />
          <div class="item-label">{{item.label}}</div>
        </div>
      </div>
    </div>

    <!-- <Page 
      :current="currentPage" 
      :total="totalPage"
      prev-text="上一页" 
      next-text="下一页"
      @on-change="handlePageChange"
      /> -->
  </div>
</template>

<script>
import { legendList, statusList } from "./define";

export default {
  name: "TableChart",

  props: {
    data: {
      type: Array,
      default: () => []
    },

    ip: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      list: [],
      legendList,
      statusList,
      ipPrefix: "",
      currentPage: 1,
      totalPage: 0,
      startIp: 0,
      endIp: 0,
      selectedItem: {}
    };
  },

  watch: {
    data(val) {
      if (!val) {
        this.list = [];
      }
      else {
        this.list = JSON.parse(JSON.stringify(val));

        this.startIp = this.list[0].ip;
        this.endIp = this.list[val.length - 1].ip;
      }
    }
  },

  methods: {
    handleSelect(item) {
      item.selected = !item.selected;

      this.selectedItem = item;

      this.list = [...this.list];
      
      this.$emit("on-selection-change", this.list.filter(item => item.selected));
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>