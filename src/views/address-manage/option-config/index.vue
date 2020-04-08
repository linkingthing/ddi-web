<template>
  <div class="option-config">   
    <TablePagination 
      title="OPTION列表"
      :data="tableData"
      :pagination-enable="false"
      :columns="columns"> 
      <template slot="top-right">
        <Button 
          type="primary" 
          @click="handleAdd" 
          class="top-button button-add"
        >
          新建
        </Button>
      </template>
    </TablePagination>

    <Edit 
      :visible.sync="showEdit"
      :data="editData"
      @confirmed="handleSaved"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";
import Edit from "./edit";

import services from "@/services/index.js"

export default {
  components:{
    TablePagination,
    Edit
  },

  data(){
    return {
      tableData:[],
      columns: [
        {
          title: "序号",
          key: "index",
          align: "center"
        },
        {
          title: "名称",
          key:"optionName",
          align: "center"
        },
        {
          title: "类型",
          key: "optionType",
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
      showEdit:false,
      editData:null
    }
  },

  mounted(){    
    this.handleQuery();
  },

  methods:{
    async handleQuery(){
      try {
        let res = await services.getOptionList();
        
        const { data } = res;

        this.tableData = data.data.map((item,idx) => {
          item.index = idx + 1;

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

    handleView(data){
      // this.$router.push(`/address-manage/ip-manage?id=${data.subnet_id}&addr=${data.subnet}`);
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
        
        await services.deleteOption(data.optionId);

        this.$$success("删除成功！");

        this.handleQuery();
      }
      catch(err){
        this.$$error(err.message || "删除失败！")
      }
    }
  }
}
</script>