<template>
  <div class="device-scan">   
    <IviewLoading v-if="loading" />

    <table-page 
      :data="tableData"
      :columns="columns"  
      :total="tableData.length"
      @on-selection-change="handleSelecChange"
    > 
      <template slot="top-right">
        <Button 
          type="primary" 
          @click="handleAdd" 
          class="top-button"
        >
          新建
        </Button>
        <Button 
          type="warning" 
          @click="handleDelete" 
          class="top-button"
        >
          删除
        </Button>
      </template>
    </table-page>

    <Edit 
      :visible.sync="showEdit"
      :data="currentData"
      @saved="handleSaved"
    />
  </div>
</template>

<script>
import Edit from "./edit";

import { columns } from "./define";

export default {
  components: {
    Edit
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      tableData: [],
      columns: columns(this),
      selectedData: [],
      showEdit: false,
      currentData: null
    };
  },

  mounted() {    
    this.handleQuery();
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      this.selectedData = [];

      try {
        let res = await this.$get({ url: this.url });
        
        this.tableData = res.data;
      } catch (err) { 
        this.$handleError(err);
      }
      finally {        
        this.loading = false;
      }
    },

    handleSelecChange(res) {
      this.selectedData = [...res];
    },

    handleAdd() {
      this.showEdit = true;
      this.currentData = null;
    },

    handleEdit(res) {
      this.showEdit = true;
      this.currentData = res;
    },

    handleSaved() {
      this.showCreate = false;

      this.handleQuery();
    },

    async handleDelete() {
      try {
        if (!this.selectedData.length) {
          this.$$warning("请选择要删除的项！");

          return;
        }

        if (this.selectedData.length > 1) {
          this.$$warning("只能删除一项！");

          return;
        }

        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        this.loading = true;
        
        await this.$delete({ url: this.url + "/" + this.selectedData[0].id });
        
        this.$$success("删除成功！");

        this.handleQuery();
      }
      catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    }
  }
};
</script>