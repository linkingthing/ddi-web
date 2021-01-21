<template>
  <div class="audit-log">

    <table-page
      :loading="loading"
      :data="tableData"
      :columns="columns"
      :total="total"
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
          :loading="loading"
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
      loading: false,
      tableData: [],
      columns: columns(this),
      conditions: {
        date: [],
        sourceIp: ""
      },
      currentPage: 1,
      total: 0,
      isSmallScreen: document.body.clientWidth <= 1366,
      showConfig: false
    };
  },

  watch: {
    currentPage: {
      immediate: true,
      handler() {
        this.handleQuery();
      }
    }
  },

  mounted() {
    const { current } = this.$route.query;
    this.currentPage = +current || 1;


  },
  methods: {
    async handleQuery() {
      this.loading = true;
      try {
        let { data, pagination } = await this.$get({ url: this.url, params: this.getParams() });

        if (data.length === 0) {
          this.currentPage = pagination.pageNum;
        }

        this.total = pagination.total;
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

      res.page_size = 10;
      res.page_num = this.currentPage || 1;
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
          case "refresh": return "终端更新";
          case "exportcsvtemplate": return "导出CSV模版";

          case "repealforward": return "下发撤回";
          case "reportforward": return "上报";
          case "dispatchforward": return "下发";
          case "cleansemanticplannodes": return "清空规划";
          case "deletesemantic": return "删除语义节点";
          case "updatesemanticnumber": return "增加语义节点个数";
          case "autoformulatesemantic": return "自动规划";
          case "updatebitwidth": return "设置位宽";
          case "addsemanticplannode": return "新增语义网络节点";
          case "updateplaninfo": return "修改规划名";
          case "updatesemanticinfo": return "修改语义名";
          case "updatesemanticipv4": return "修改语义IPv4";
          case "listviewv4": return "获取规划IPv4列表";
          case "listviewv6": return "获取规划IPv6列表";
          case "addplannodeignoreconflict": return "编辑忽略地址池冲突请求";
          case "formulateignoreconflict": return "自动规划有地址池冲突请求";

          case "export": return "导出";
          case "importcsv": return "批量导入";

          case "disable": return "禁用";
          case "enable": return "启用";

          case "changepriority": return "调整优先级";
          case "switchrecursion": return "切换递归";

        }
      };

      const opper = getOpperText(method) + "-";

      return `${username}${opper}${resources[resourceKind]}`;
    },
    handleOpenMessage(row) {
      let message = row.succeed
        ? JSON.stringify(JSON.parse(row.parameters), null, 2)
        : row.errMessage;

      message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
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