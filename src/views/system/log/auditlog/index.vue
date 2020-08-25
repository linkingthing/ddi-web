<template>
  <div class="audit-log">
    <IviewLoading v-if="loading" />

    <table-page
      :data="tableData"
      :columns="columns"
      :total="tableData.length"
      :current.sync="currentPage"
    >
      <template slot="top-right">
        <div class="condition-item">
          <label class="condition-item-label">时间：</label>
          <DatePicker
            v-model="conditions.date"
            format="yyyy-MM-dd"
            type="daterange"
            placement="bottom"
            placeholder="请选择时间"
          />
        </div>
        <div class="condition-item">
          <label class="condition-item-label">IP地址：</label>
          <Input
            v-model="conditions.sourceIp"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <btn-search
          type="primary"
          @click="handleQuery"
          class="top-button"
        >
          搜索
        </btn-search>
      </template>
    </table-page>
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
      currentPage: 1,
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

      this.currentPage = 1;

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
      const { date, sourceIp } = this.conditions;

      let res = {};

      if (sourceIp.trim()) {
        res.source_ip = sourceIp.trim();
      }

      if (date[0]) {
        res.from = date[0].toLocaleDateString().replace(/\//g, "-");
        res.to = date[1].toLocaleDateString().replace(/\//g, "-");
      }

      return res;
    },

    formatContent(data) {
      const { username, method, resourceKind, succeed, errMessage } = data;

      const getOpperText = opper => {
        switch (opper.toLocaleLowerCase()) {
          case "put": return "更新";
          case "post": return "新建";
          case "delete": return "删除";
          case "exportcsv": return "导出";
          case "changingrrs": return "A和AAAA记录切换";
          case "snmp": return "更新地址探测";
        }
      };
      
      const opper = getOpperText(method) + "-";

      return `${username}${opper}${resources[resourceKind]}`;
    },
    handleOpenMessage(row) {
      const message = row.succeed
        ? JSON.stringify(JSON.parse(row.parameters), null, 2)
        : row.errMessage;
      this.$Modal.info({
        scrollable: true,
        width: 800,
        title: "详细信息",
        content: `<pre>${message}</pre>`
      });
    }
  }
};
</script>