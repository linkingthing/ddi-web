<template>
  <div class="ip-assets-manage">   
    <IviewLoading v-if="loading" />

    <table-page 
      :data="tableData"
      :columns="columns"  
      :total="tableData.length"
      :is-padding-top="true"
    > 
      <template slot="top-left">
        <div class="condition-item">
          <label class="condition-item-label">IP地址：</label>
          <Input
            v-model="condition.ip"
            placeholder="请输入IP地址"
            class="top-input"
            @on-enter="handleQuery" />
        </div>
        <div class="condition-item">
          <label class="condition-item-label">主机名：</label>
          <Input
            v-model="condition.name"
            placeholder="请输入IP地址"
            class="top-input"
            @on-enter="handleQuery" />
        </div>

        <Button 
          type="primary" 
          @click="handleQuery" 
        >
          搜索
        </Button>
      </template>

      <template slot="top-right">
        <Button 
          type="primary" 
          @click="handleAdd" 
          class="top-button"
        >
          新建
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

<style lang="less">
@import "index.less";
</style>

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
      ip: "",
      name: "",
      condition: {
        ip: "",
        name: ""
      },
      tableData: [],
      columns: columns(this),
      showEdit: false,
      currentData: null
    };
  },

  async mounted() {    
    this.handleQuery();

    const { id, ip } = this.$route.query;

    if (id) {
      try {
        let data = await this.$get({ url: this.url + "/" + id });        

        this.currentData = data;
      } catch (err) {
        this.$handleError(err);
      }
    }
    else if (ip) {
      this.currentData = { ip };
    }

    if (ip) {
      this.showEdit = true;
    }
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      try {
        let { url, condition } = this;

        let { data } = await this.$get({ url: this.$formatQuerys(condition, url) });
        
        this.tableData = data;
      } catch (err) {
        this.$handleError(err);
      }
      finally {        
        this.loading = false;
      }
    },

    handleAdd() {
      this.showEdit = true;
      this.currentData = null;
    },

    handleEdit(res) {
      this.showEdit = true;
      this.currentData = { ...res };
    },

    handleSaved() {
      this.handleQuery();
    },

    async handleDelete({ id }) {
      try {

        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        this.loading = true;
        
        await this.$delete({ url: this.url + "/" + id });
        
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