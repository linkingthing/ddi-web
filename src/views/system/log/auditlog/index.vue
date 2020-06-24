<template>
  <div class="audit-log">   
    <IviewLoading v-if="loading" />

    <table-page 
      :data="tableData"
      :columns="columns"  
      :total="tableData.length"
    > 
      <template slot="top-right">
        <div class="condition-item">
          <label class="condition-item-label">时间：</label>
          <DatePicker
            v-model="conditions.date"
            format="yyyy-MM-dd"
            type="daterange"
            placement="bottom"
            placeholder="请选择时间"/>
        </div>
        <div class="condition-item">
          <label class="condition-item-label">IP地址：</label>
          <Input
            v-model="conditions.sourceIp"
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
import resources from "@/dictionary/resources";

export default {
  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      tableData: [],
      columns: columns(this),
      conditions: {
        date: [],
        sourceIp: ""
      },
      isSmallScreen: document.body.clientWidth <= 1366,
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
          item.creationTime = this.$trimDate(item.creationTimestamp);
          item.content = this.formatContent(item);
          item.opperText = item.succeed ? "操作成功" : "操作失败";

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
      const { date,sourceIp } = this.conditions;

      let res = {};

      if (sourceIp.trim()) {
        res.source_ip = sourceIp.trim();
      }
      
      if (date[0]) {
        res.from = date[0].toLocaleDateString().replace(/\//g,"-");
        res.to = date[1].toLocaleDateString().replace(/\//g,"-");
      }

      return res;
    },

    formatContent(data) {
      const getOpperText = opper => {
        switch (opper.toLocaleLowerCase()) {
          case "put":return "更新";
          case "post":return "新建";
          case "delete": return "删除";
        }
      };

      return `${data.username}${getOpperText(data.method)}${resources[data.resourceKind]}${data.succeed ? "" : ("失败：" + data.errMessage)}`;
    }
  }
};
</script>