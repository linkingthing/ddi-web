<template>
  <div class="child-net-manage">   
    <TablePagination 
      title="网络管理"
      :data="tableData"
      :columns="columns"> 
      <template slot="top-left">
        <Input v-model="keywords" placeholder="请输入子网地址" class="top-input" />
        <Button type="primary" icon="ios-search" @click="handleQuery" class="top-button">查询</Button>
      </template>
      <template slot="top-right">
        <Button 
          type="primary" 
          @click="handleAdd" 
          class="top-button button-add"
        >
          新建
        </Button>
        <Button 
          type="primary" 
          @click="handleSplit" 
          class="top-button button-split"
        >
          子网拆分
        </Button>
        <Button 
          type="primary" 
          @click="handleMerge" 
          class="top-button button-merge"
        >
          子网合并
        </Button>
      </template>
    </TablePagination>

    <Edit 
      :visible.sync="showEdit"
      :data="editData"
    />

    <MergeSplit 
      :visible.sync="showMergSplit"
      :data="mergeSplitData"
      :type="mergeSplitType"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "./../../../../components/TablePagination";
import Edit from "./edit";
import MergeSplit from "./merge-split"

import { operateTypes } from "./define";

export default {
  components:{
    TablePagination,
    Edit,
    MergeSplit
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
  },

  methods:{
    handleQuery(){

    },

    handleAdd(){
      this.showEdit = true;

      this.editData = null;
    },

    handleSplit(){
      this.mergeSplitType = operateTypes.split;
      this.showMergSplit = true;
      this.mergeSplitData = this.selectedData;
    },

    handleMerge(){
      this.mergeSplitType = operateTypes.merge;
      this.showMergSplit = true;
      this.mergeSplitData = this.selectedData;
    },

    handleView(data){
      this.$router.push("/address-manage/ip-manage");
    },

    handleEdit(data){
      this.showEdit = true;

      this.editData = data;
    },

    async handleDelete(data){
      try{
        await this.$$confirm({ content:"您确定要删除当前数据吗？" });

        alert("删除")
      }
      catch(e){}
    }
  }
}
</script>