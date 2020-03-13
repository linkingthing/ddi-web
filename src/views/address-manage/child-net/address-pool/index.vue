<template>
  <div class="address-pool">   
    <TablePagination 
      title="地址池管理"
      :data="tableData"
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
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "./../../../../components/TablePagination";
import Edit from "./edit";

export default {
  components:{
    TablePagination,
    Edit
  },

  data(){
    return {
      keywords:"",
      tableData:[
        {
          ipAddress:"1111111dfaes2345rea",
          addressTotalCount:"192.168.1.1",
          type:12,
          createDate:"543gfesd",
          useRatio:"30%"
        },
        {
          ipAddress:"2222222dfaes2345rea",
          addressTotalCount:"192.168.1.1",
          type:12,
          createDate:"543gfesd",
          useRatio:"30%"
        }
      ],
      columns: [
        {
          title: "IP地址",
          key: "ipAddress",
          align: "center"
        },
        {
          title: "地址总量",
          render: (h, { row }) => {
            return h('label', {
              class: 'address-total-count',
              on: {
                click: () => {
                  this.handleView(row)
                }
              }
            }, row.addressTotalCount)
          },
          align: "center"
        },
        {
          title: "类型",
          key: "type",
          align: "center"
        },
        {
          title: "创建时间",
          key: "createDate",
          align: "center"
        },
        {
          title: "DHCP使用率",
          key: "useRatio",
          align: "center"
        },
        {
          title: "操作",
          align: "right",      
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
    // this.tableData = [];
  },

  methods:{
    handleQuery(){

    },

    handleAdd(){
      this.showEdit = true;

      this.editData = null;
    },

    handleView(data){

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