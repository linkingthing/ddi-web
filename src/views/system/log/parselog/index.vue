<template>
  <div class="parse-log">
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
            @on-enter="handleQuery"
          />
        </div>

        <btn-search
          type="primary"
          @click="handleQuery"
        >
          搜索
        </btn-search>

        <Button
          style="margin-left: 26px;"
          type="primary"
          @click="handleExportLog"
        >导出</Button>
      </template>
    </table-page>
  </div>
</template>

<script>
import qs from "qs";
import resources from "@/dictionary/resources";

export default {
  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      tableData: [],
      links: {},
      columns: [
        {
          title: "时间",
          key: "creationTime",
          align: "left",
          width: 200
        },
        {
          title: "节点IP",
          key: "nodeIP",
          align: "center",
          width: 200
        },
        {
          title: "内容",
          key: "content",
          align: "left"

        }
      ],
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
        let { data, links } = await this.$get({ url: this.url, params: this.getParams() });
        this.links = links;
        this.tableData = data.map(item => {
          item.creationTime = this.$trimDate(item.time);
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
        res.node_ip = sourceIp.trim();
      }

      if (date[0]) {
        const [start, end] = date;
        res.from = this.$trimDate(start, "YYYY-MM-DD") // date[0].toLocaleDateString().replace(/\//g, "-");
        res.to = this.$trimDate(end, "YYYY-MM-DD") // date[1].toLocaleDateString().replace(/\//g, "-");
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
        }
      };

      const opper = getOpperText(method);

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
    },
    handleExportLog() {
      const link = this.links.self || "/apis/linkingthing.com/log/v1/dnslogs";
      const params = this.getParams();
      let url = `${link}/dnslog?action=exportcsv`;
      const query = qs.stringify(params);
      if (query) {
        url += `&${query}`;
      }

      this.$post({ url, params }).then(res => {
        const { downloadPath, fileName } = this.pathParser(res);
        this.downloadFile(downloadPath, fileName);
      });
    },
    pathParser({ path }) {
      const realPath = "/opt/website/";
      const staticPath = "/public/";
      const fileName = path.replace(realPath, "");
      return {
        downloadPath: staticPath.concat(fileName),
        fileName
      };
    },
    downloadFile(path, fileName) {
      let a = document.createElement("a");
      a.href = path;
      a.download = fileName;
      a.click();
    }
  }
};
</script>

<style lang="less">
.parse-log {
  .top-left,
  .top-right {
    display: flex;
    align-items: center;
    height: 72px;
    line-height: 72px;
    justify-content: flex-start;

    .ivu-input {
      width: 220px;
      background: transparent;
      border-color: #cccccc;
      font-size: 14px;
    }

    .top-input {
      width: auto;
    }

    .condition-item {
      display: flex;
      align-items: center;
      margin-right: 26px;

      &:last-child {
        margin-right: 0;
      }
    }

    .condition-item-label {
      font-size: 14px;
      color: #333;
      white-space: nowrap;
    }
  }
}
</style>