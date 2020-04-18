<template>
  <div class="child-net-manage">   
    <TablePagination 
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
      @success="handleQuery"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";
import Edit from "./edit";
import Create from "./create";
import MergeSplit from "./merge-split";

import { operateTypes, columns } from "./define";

import services from "@/services/index.js";
import { getAddressType } from "@/util/common";

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
      columns: columns(this),
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
        let { status, data, message } = await services.getChildNetList();

        if (+status === 200) {
          this.tableData = data.data.map(item => {
            item.creationTimestamp = item.embedded.creationTimestamp ? item.embedded.creationTimestamp.replace(/(T|Z)/g, " ") : "";

            return item;
          });
        }
        else {
          Promise.reject({ message });
        }
        
      } catch (err) {
        console.error(err);
          
        this.$$error(err.message || "数据请求错误！");
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
      this.$router.push(`/ipam-manage/ip-manage?subnetId=${data.subnet_id}&addr=${data.subnet}`);
    },

    handleSaved() {
      this.handleQuery();
    },

    async handleDelete(data) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        const action = getAddressType(data.subnet) === "ipv4" ? "deleteIPv4ChildNet" : "deleteIPv6ChildNet";
        
        await services[action](data.subnet_id);

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