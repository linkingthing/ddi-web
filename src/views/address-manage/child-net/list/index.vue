<template>
  <div class="child-net-manage">   
    <TablePagination 
      title="网络管理"
      :data="tableData"
      :pagination-enable="false"
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
      @confirmed="handleSaved"
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

import services from "./../../../../services/index.js"

export default {
  components:{
    TablePagination,
    Edit,
    MergeSplit
  },

  data(){
    return {
      keywords:"",
      tableData:[],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: "center"
        },
        {
          title: "子网名称",
          key: "name",
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
            }, row.subnet)
          },
          align: "center"
        },
        {
          title: "地址数量",
          key: "total",
          align: "center"
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          align: "center"
        },
        {
          title: "子网地址使用率",
          key: "usage",
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
    this.handleQuery();
  },

  methods:{
    async handleQuery(){
      try {
        let res = await services.getChildNetList();
        
        const { data } = res;

        this.tableData = data.data.map(item => {
          item.creationTimestamp = item.creationTimestamp ? item.creationTimestamp.replace("T", " ") : "";

          return item;
        });
        
      } catch (err) {
        console.error(err);
        
      }
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
      this.$router.push(`/address-manage/ip-manage?id=${data.subnet_id}&addr=${data.subnet}`);
    },

    handleEdit(data){
      this.showEdit = true;

      this.editData = data;
    },

    handleSaved(){
      this.handleQuery();
    },

    async handleDelete(data){
      try{
        await this.$$confirm({ content:"您确定要删除当前数据吗？" });
        
        await services.deleteChildNet(data.subnet_id);

        this.$$message("删除成功！", "success");

        this.handleQuery();
      }
      catch(err){
        this.$$message(err.message || "删除失败！", "error")
      }
    }
  }
}
</script>