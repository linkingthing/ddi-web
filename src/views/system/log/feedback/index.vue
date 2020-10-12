<template>
  <div class="parse-log">
    <IviewLoading v-if="loading" />

    <table-page
      :data="agentEventList"
      :columns="columns"
      :current.sync="currentPage"
      :pagination-enable="true"
      :total="agentEventCount"
    />
  </div>
</template>

<script>
import qs from "qs";
import resources, { operateMap } from "@/dictionary/resources";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      links: {},
      columns: [
        {
          title: "时间",
          key: "operationTime",
          align: "left",
          width: 200
        },
        {
          title: "节点IP",
          key: "node",
          align: "center",
          width: 200
        },
        {
          title: "内容",
          key: "message",
          align: "left",
          render: (h, { row }) => {
            const str = `${operateMap[row.method]} ${resources[row.resource]} ${row.succeed ? "成功" : "失败"} `;
            return h("div", [str,
              h("Icon", {
                style: {
                  verticalAlign: "baseline",
                  paddingLeft: "10px",
                  fontSize: "16px",
                  cursor: "pointer"
                },
                props: {
                  custom: "icon-detail"
                },
                on: {
                  click: () => this.handleOpenMessage(row)
                },
              }),
            ]);
          }

        },
        {
          title: "状态",
          key: "node",
          align: "right",
          width: 120,
          render: (h, { row }) => {
            return h("div", row.succeed ? "操作成功" : "操作失败")
          }
        },
      ],
      conditions: {
        date: [],
        sourceIp: ""
      },
      currentPage: 0,
      isSmallScreen: document.body.clientWidth <= 1366,
      showConfig: false
    };
  },

  computed: {
    ...mapGetters(["agentEventCount"]),
    agentEventList() {
      const current = this.currentPage || 1;
      return this.$store.getters.agentEventList({ current });
    }
  },

  methods: {

    getParams() {
      const { date, sourceIp } = this.conditions;

      let res = {};

      if (sourceIp.trim()) {
        res.node_ip = sourceIp.trim();
      }

      if (date[0]) {
        const [start, end] = date;
        res.from = this.$trimDate(start, "YYYY-MM-DD");
        res.to = this.$trimDate(end, "YYYY-MM-DD");
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
      const cmdMessage = JSON.stringify(JSON.parse(row.cmdMessage), null, 2);
      const errMessage = row.errorMessage ? `错误信息：${row.errorMessage}` : "操作成功";
      this.$Modal.info({
        scrollable: true,
        width: 800,
        title: "详细信息",
        content: `<pre>${cmdMessage}</pre><br /> <pre>${errMessage}</pre>`
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
pre {
  padding: 1rem;
  max-height: 35rem;
  line-height: 1.5;
  background-color: #e9ecef;
  overflow: auto;
  margin-left: -40px;
}
</style>