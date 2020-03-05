<template>
  <div class="option-config">   
    <TablePagination 
      title="OPTION配置"
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
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "./../../../components/TablePagination";

export default {
  components:{
    TablePagination
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
          title: "名称",
          key: "addressName",
          align: "center"
        },
        {
          title: "类型",
          key:"addressType",
          align: "center"
        },
        {
          title: "数量",
          key: "addressCount",
          align: "center"
        },
        {
          title: "备注",
          key: "createDate",
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
      selectedData:[]
    }
  },

  mounted(){
    // this.tableData = [];
  },

  methods:{
    handleAdd(){

    },

    handleEdit(data){

    },

    handleDelete(data){

    }
  }
}
</script>