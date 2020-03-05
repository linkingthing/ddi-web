<template>
  <div class="ip-manage-table-chart">
    <div class="table-chart-content">
      <div class="table-chart-list">
        <div 
          v-for="(item, idx) in list"
          :key="idx"
          class="item-square"
          :class="{
            'is-unused':item.status === statusList.unused,
            'is-pool':item.status === statusList.isPool,
            'is-reflect':item.status === statusList.isReflect,
            'is-keeping':item.status === statusList.isKeeping,
            'is-active':item.status === statusList.isActive,
            'is-fixed':item.status === statusList.isFixed,
            'is-selected':item.status === statusList.isSelected,
            'is-zombie':item.status === statusList.isZombie
          }"
          @click="handleSelect(item)"
        />
      </div>
      <div class="ip-range">当前IP段{{`${ipPrefix}.0~${ipPrefix}.255`}}</div>

      <div class="item-title">IP地址</div>
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
              'is-pool':item.isPool,
              'is-reflect':item.isReflect,
              'is-keeping':item.isKeeping,
              'is-active':item.isActive,
              'is-fixed':item.isFixed,
              'is-selected':item.isSelected,
              'is-zombie':item.isZombie
            }" 
          />
          <div class="item-label">{{item.label}}</div>
        </div>
      </div>
    </div>

    <Page 
      :current="currentPage" 
      :total="totalPage"
      prev-text="上一页" 
      next-text="下一页"
      @on-change="handlePageChange"
      />
  </div>
</template>

<script>
import { legendList, statusList } from "./define"

export default {
  name: "TableChart",

  props:{
    data:{
      type: Array,
      default: () => []
    },

    ip:{
      type:String,
      default:""
    }
  },

  data(){
    return {
      list:[],
      legendList,
      statusList,
      ipPrefix:"",
      currentPage:1,
      totalPage:0
    }
  },

  watch:{
    ip(val){
      let arr = [];

      const ipArr = val.split(".");

      ipArr.splice(2, 1);

      this.ipPrefix = ipArr.join(".");

      for(let i = 0; i < 256; i++){
        arr.push({
          status:statusList.isPool,
          ip:`${this.ipPrefix}.${i}`
        });
      }

      this.list = arr;
      
    }
  },

  methods:{
    handlePageChange(val){

    }
  }
}
</script>

<style lang="less">
@import "./index.less";
</style>