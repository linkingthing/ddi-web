<template>
  <div class="operate-logs">   
    <IviewLoading v-if="loading" />

    <table-page 
      :data="tableData"
      :columns="columns"  
      :total="tableData.length"
    > 
      <template slot="top-right">
        <div class="condition-item">
          <label class="condition-item-label">时间：</label>
          <Input
            v-model="condition.date"
            class="top-input"
            @on-enter="handleQuery" />
        </div>
        <div class="condition-item">
          <label class="condition-item-label">IP地址：</label>
          <Input
            v-model="condition.ip"
            class="top-input"
            @on-enter="handleQuery" />
        </div>
        <div class="condition-item">
          <label class="condition-item-label">操作：</label>
          <Input
            v-model="condition.operate"
            class="top-input"
            @on-enter="handleQuery" />
        </div>
        <div class="condition-item">
          <label class="condition-item-label">结果：</label>
          <Input
            v-model="condition.result"
            class="top-input"
            @on-enter="handleQuery" />
        </div>

        <Button 
          type="primary" 
          @click="handleQuery" 
          class="top-button"
        >
          搜索
        </Button>
      </template>
    </table-page >
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import { columns } from "./define";

export default {
  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      tableData: [],
      columns: columns(this),
      conditions: {
        date: "",
        ip: "",
        operate: "",
        result: ""
      },
      showConfig: false
    };
  },

  mounted() {    
    this.handleQuery();
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      try {
        let { data } = await this.$get({ url: this.url, params: this.getParams() });
        
        this.tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);

          return item;
        });
      } catch (err) {
        this.$handleError(err); 
      }
      finally {        
        this.loading = false;
      }
    },

    getParams() {
      return {
        ...this.conditions
      };
    }
  }
};
</script>