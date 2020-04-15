<template>
  <div class="child-net-manage">   
    <TablePagination 
      title="网络管理"
      :data="tableData"
      :pagination-enable="false"
      :columns="columns"  
      @on-selection-change="handleSelecChange"
    > 
      <template slot="top-left">
        <Input
          v-model="keywords"
          placeholder="请输入子网地址"
          class="top-input" />
        <Button
          type="primary"
          icon="ios-search"
          @click="handleQuery"
          class="top-button">查询</Button>
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

    <Create 
      :visible.sync="showCreate"
      @confirmed="handleSaved"
    />

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
import Create from "./create";
import MergeSplit from "./merge-split";

import { operateTypes } from "./define";

import services from "./../../../../services/index.js";

export default {
  components: {
    TablePagination,
    Create,
    Edit,
    MergeSplit
  },

  data() {
    return {
      keywords: "",
      tableData: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "网络地址",
          render: (h, { row }) => {
            return h("label", {
              class: "net-address",
              on: {
                click: () => {
                  this.handleView(row);
                }
              }
            }, row.subnet);
          },
          align: "center"
        },
        {
          title: "区域",
          key: "name",
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
          title: "使用率",
          key: "usage",
          align: "center"
        },
        {
          title: "操作",
          align: "center",      
          render: (h, { row }) => {
            return h("div", [
              h("label", {
                class: "operate-label operate-edit",
                on: {
                  click: () => {
                    this.handleEdit(row);
                  }
                }
              }, "编辑"),
              h("label", {
                class: "operate-label operate-delete",
                on: {
                  click: () => {
                    this.handleDelete(row);
                  }
                }
              }, "删除")
            ]);
          }
        }
      ],
      selectedData: [],
      showCreate: false,
      showEdit: false,
      editData: null,
      showMergSplit: false,
      mergeSplitData: null,
      mergeSplitType: null
    };
  },

  mounted() {    
    this.handleQuery();
  },

  methods: {
    async handleQuery() {
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

    handleSelecChange(res) {
      this.selectedData = [...res];
    },

    handleAdd() {
      this.showCreate = true;
    },

    handleEdit(data) {
      this.showEdit = true;

      this.editData = data;
    },

    handleSplit() {
      if (this.selectedData.length > 1) {
        this.$$warning("只能对一个子网进行拆分！");

        return;
      }
      else if (!this.selectedData.length) {
        this.$$warning("请选择一个子网进行拆分！");

        return;
      }

      this.mergeSplitType = operateTypes.split;
      this.showMergSplit = true;
      this.mergeSplitData = this.selectedData;
    },

    handleMerge() {
      if (this.selectedData.length <= 1) {
        this.$$warning("请选择多个子网进行合并！");

        return;
      }

      this.mergeSplitType = operateTypes.merge;
      this.showMergSplit = true;
      this.mergeSplitData = this.selectedData;
    },

    handleView(data) {
      this.$router.push(`/ipam-manage/ip-manage?id=${data.subnet_id}&addr=${data.subnet}`);
    },

    handleSaved() {
      this.handleQuery();
    },

    async handleDelete(data) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });
        
        await services.deleteChildNet(data.subnet_id);

        this.$$success("删除成功！");

        this.handleQuery();
      }
      catch (err) {
        this.$$error(err.message || "删除失败！");
      }
    }
  }
};
</script>