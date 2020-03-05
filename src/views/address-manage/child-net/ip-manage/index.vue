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
          @click="handleFix" 
          class="top-button button-fix"
        >
          转固定
        </Button>
        <Button 
          type="primary" 
          @click="handleKeep" 
          class="top-button button-keep"
        >
          转保留
        </Button>
      </div>
    </div>

    <Table 
      v-show="tab === 'table'"
      :data="tableData"
      :columns="columns" 
    /> 

    <TableChart 
      v-show="tab === 'chart'"
      :data="tableData"
      :ip="currentIp"
    />

    <Search 
      :visible.sync="showEdit"
      :data="editData"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "./../../../../components/TablePagination";
import TableChart from "./table-chart"
import Search from "./search";

export default {
  components:{
    TablePagination,
    TableChart,
    Search,
  },

  data(){
    return {
      keywords:"",
      tableData:[
        {
          addressName:"1111111dfaes2345rea",
          netAddress:"192.168.1.1",
          addressCount:12,
          createDate:"543gfesd",
          useRatio:"30%"
        },
        {
          addressName:"2222222dfaes2345rea",
          netAddress:"192.168.1.1",
          addressCount:12,
          createDate:"543gfesd",
          useRatio:"30%"
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: "center"
        },
        {
          title: "子网名称",
          key: "addressName",
          align: "center"
        },
        {
          title: "子网地址",
          render: (h, { row }) => {
            return h('label', {
              class: 'net-address',
              on: {
                click: () => {
                  this.handleView(row)
                }
              }
            }, row.netAddress)
          },
          align: "center"
        },
        {
          title: "地址数量",
          key: "addressCount",
          align: "center"
        },
        {
          title: "创建时间",
          key: "createDate",
          align: "center"
        },
        {
          title: "子网地址使用率",
          key: "useRatio",
          align: "center"
        },
        {
          title: "操作",
          align: "center",      
          render: (h, { row }) => {
            return h('div', [
              h('label', {
                class: 'operate-label operate-edit',
                on: {
                  click: () => {
                    this.handleEdit(row)
                  }
                }
              }, '编辑'),
              h('label', {
                class: 'operate-label operate-delete',
                on: {
                  click: () => {
                    this.handleDelete(row)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      tab:"chart",
      currentIp:"",
      selectedData:[],
      showEdit:false,
      editData:null,
      showMergSplit:false,
      mergeSplitData:null,
      mergeSplitType:null
    }
  },

  mounted(){
    // this.tableData = [];

    this.currentIp = "10.0.3.54";
  },

  methods:{
    handleQuery(){

    },

    handleSearch(){
      
    },

    handleConfig(){
      this.$router.push("/address-manage/address-pool")
    },

    handleFix(){
      
    },

    handleKeep(data){

    }
  }
}
</script>