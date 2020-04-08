<template>
  <div class="child-net-ip-manage">
    <div class="ip-manage-title">IP管理</div>

    <div class="ip-manage-top">
      <Tabs v-model="tab">
        <TabPane label="图形" name="chart"></TabPane>
        <TabPane label="列表" name="table"></TabPane>
      </Tabs>

      <div>
        <Button 
          type="primary" 
          @click="handleSearch" 
          class="top-button button-search"
        >
          网络探测
        </Button>
        <Button 
          type="primary" 
          @click="handleConfig" 
          class="top-button button-config"
        >
          地址池配置
        </Button>
        <Button 
          type="primary" 
          @click="handleFixAndKeep('固定')" 
          class="top-button button-fix"
        >
          转固定
        </Button>
        <Button 
          type="primary" 
          @click="handleFixAndKeep('保留')" 
          class="top-button button-keep"
        >
          转保留
        </Button>
      </div>
    </div>

    <div>
      <Table 
        v-show="tab === 'table'"
        :data="tableData"
        :columns="columns" 
        :max-height="540"
        @on-selection-change="handleTableSelect"
      /> 
    </div>

    <TableChart 
      v-show="tab === 'chart'"
      :data="tableData"
      @on-selection-change="handleTableSelect"
    />

    <FixOrKeep 
      :visible.sync="showFixOrKeep"
      :data="selectedData"
      :type="typeofFixOrKeep"
      @confirmed="handleFixedOrKept"
    />

    <Search 
      :visible.sync="showSearch"
      :data="selectedData"
      @confirmed="handleSearched"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TableChart from "./table-chart";
import FixOrKeep from "./fix-or-keep";
import Search from "./search";
import service from "@/services";

import { columns } from "./define"

export default {
  components:{
    TableChart,
    FixOrKeep,
    Search,
  },

  data(){
    return {
      id:"",
      ipAddress:"",
      tableData:[],
      columns,
      tab:"chart",
      selectedData:[],
      showSearch:false,
      showFixOrKeep:false,
      typeofFixOrKeep:""
    }
  },

  mounted(){
    const {id, addr} = this.$route.query

    this.id = id;
    this.ipAddress = addr;

    this.handleQuery();
  },

  methods:{
    getIpLastNum(ip){
      return parseInt(ip.substr(ip.lastIndexOf(".") + 1));
    },

    async handleQuery(){
      this.selectedData = [];

      try {
        let { status, data, message } = await service.getPlanIpList(this.id);
        
        if(status === 200){
          this.tableData = Object.entries(data.data)
            .map(([ip, values]) => ({ ip, ...values }))
            .sort((prev, next) => this.getIpLastNum(prev.ip) - this.getIpLastNum(next.ip));
        }
        else{
          Promise.reject({ message })
        }
      } catch (err) {
        console.error(err);
        
        this.$$error(err.message || "请求失败！")
      }
    },

    handleTableSelect(datas){
      this.selectedData = datas;            
    },

    handleSearch(){
      if(this.selectedData.length > 1){
        this.$$warning("只能对一个地址进行检测！");

        return;
      }
      else if(!this.selectedData.length){
        this.$$warning("请选择一个地址进行检测！");

        return;
      }

      this.showSearch = true;
    },

    handleSearched(){
      this.handleQuery();
    },

    handleConfig(){
      this.$router.push(`/address-manage/address-pool?id=${this.id}`)
    },

    async handleDelete(item){
      try {
        await service.deleteIpAddress(item.id);
      } catch (err) {
        console.error(err);
        
        this.$$error(err.message || "删除失败");
      }
    },

    handleFixAndKeep(type){      
      if(this.selectedData.length > 1){
        this.$$warning("只能对一个地址进行操作！");

        return;
      }
      else if(!this.selectedData.length){
        this.$$warning("请选择一个地址进行操作！");

        return;
      }

      this.typeofFixOrKeep = type;
      this.showFixOrKeep = true;
    },

    handleFixedOrKept(){
      this.handleQuery();
    }
  }
}
</script>