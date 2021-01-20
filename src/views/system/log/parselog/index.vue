<template>
  <div class="parse-log">

    <table-page
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
          <label class="condition-item-label">节点IP地址：</label>
          <Input
            v-model="conditions.dest_ip"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">请求IP地址：</label>
          <Input
            v-model="conditions.src_ip"
            @on-enter="handleQuery"
          />
        </div>

        <btn-search
          type="primary"
          @click="handleQuery"
          :loading="loading"
        >
          搜索
        </btn-search>

        <Button
          style="margin-left: 26px;"
          type="primary"
          @click="handleExportLog"
        >FTP导出</Button>

        <common-modal
          class="acl-modal"
          :visible.sync="dialogVisible"
          title="ftp导出"
          :width="413"
          :buttons="buttonConfig"
          @confirm="handleConfirm('formInline')"
          ok-text="导出解析日志"
          :disabled="status.includes('ing')"
          :loading="loading"
        >
          <Form
            ref="formInline"
            label-position="left"
            :label-width="100"
            :label-colon="true"
            :rules="rules"
            :model="formModel"
          >
            <FormItem
              label="服务器地址"
              prop="address"
            >
              <Input
                placeholder="请输入服务器地址"
                v-model="formModel.address"
              />
            </FormItem>
            <FormItem
              label="账号名称"
              prop="userName"
            >
              <Input
                placeholder="请输入账号名称"
                v-model="formModel.userName"
              />

            </FormItem>
            <FormItem
              label="密码"
              prop="password"
            >
              <Input
                type="password"
                placeholder="请输入密码"
                v-model="formModel.password"
              />

            </FormItem>
            <div style="text-align: center;font-size: 14px">

              <p :style="{color: statusMap.color}">
                <img
                  style="vertical-align: bottom;"
                  v-if="statusMap.icon"
                  :src="require(`./${statusMap.icon}.png`)"
                  alt=""
                > {{statusMap.text}}
                <span style="color: #999;padding-left: 20">
                  {{finishTime}}
                </span>
              </p>
            </div>

          </Form>
        </common-modal>

      </template>
    </table-page>
  </div>
</template>

<script>
import qs from "qs";
import resources from "@/dictionary/resources";

export default {
  data() {

    this.rules = {

    };
    return {
      dialogVisible: false,
      url: this.$getApiByRoute().url,
      loading: false,
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
          title: "节点IP地址",
          key: "nodeIP",
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
        src_ip: "",
        dest_ip: ""
      },
      total: 0,
      currentPage: 0,
      isSmallScreen: document.body.clientWidth <= 1366,
      showConfig: false,
      formModel: {
        address: "",
        userName: "",
        password: ""
      },
      timer: null,
      status: "",
      finishTime: ""
    };
  },

  computed: {
    buttonConfig() {
      return [{
        label: "取消",
        type: "default",
        class: "button-cancel",
        event: "cancel"
      },
      {
        label: "导出解析日志",
        type: "primary",
        class: "button-confirm",
        event: "confirm",
        disabled: this.status.includes("ing")
      }];
    },
    statusMap() {
      const statusMap = {
        connecting: {
          color: "#4586FE",
          text: "连接中...",
          icon: ""
        },
        connectFailed: {
          color: "#FF9024",
          text: "连接失败",
          icon: "warn"
        },
        transporting: {
          color: "#4586FE",
          text: "上传中...",
          icon: ""
        },
        transportFailed: {
          color: "#FC4545",
          text: "上传失败",
          icon: "close"
        },
        completed: {
          color: "#40C85A",
          text: "上传完成",
          icon: "success"
        }

      };
      return statusMap[this.status] || {}
    }
  },

  watch: {
    dialogVisible(val) {
      if (!val) {
        clearInterval(this.timer);
        this.$refs.formInline.resetFields();
      }
    },
    currentPage() {
      this.handleQuery();
    }
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      try {
        let { data, links, pagination } = await this.$get({ url: this.url, params: this.getParams() });
        this.links = links;
        this.total = pagination.total;

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
      const { date, src_ip, dest_ip } = this.conditions;

      let res = {};

      if (src_ip.trim()) {
        res.src_ip = src_ip.trim();
      }
      if (dest_ip.trim()) {
        res.dest_ip = dest_ip.trim();
      }

      if (date[0]) {
        const [start, end] = date;
        res.from = this.$trimDate(start, "YYYY-MM-DD"); // date[0].toLocaleDateString().replace(/\//g, "-");
        res.to = this.$trimDate(end, "YYYY-MM-DD"); // date[1].toLocaleDateString().replace(/\//g, "-");
      }

      res.page_size = 10;
      res.page_num = this.currentPage;

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
    },
    handleExportLog() {
      this.dialogVisible = true;
      this.getUploadlogs();
      this.timer = setInterval(() => {
        if (this.status.includes("ing")) {
          this.getUploadlogs();
        }
      }, 2000);
    },
    getUploadlogs() {
      this.$get(this.$getApiByRoute("/system/log/uploadlogs")).then(res => {
        const { data } = res;
        if (Array.isArray(data) && data.length) {
          const { userName, address, status, finishTime } = data[0];
          this.formModel.userName = userName;
          this.formModel.address = address;

          this.status = status;
          this.finishTime = finishTime;
        }
      });
    },

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = this.formModel;
          this.loading = true;
          let { url } = this.$getApiByRoute("/system/log/uploadlogs");
          url += "/1?action=uploadLog";
          this.$post({ params, url }).then(({ status }) => {
            this.status = status;
            this.loading = false;
          }).catch(err => {
            this.loading = false;
            this.$Message.error(err.response.data.message);
          });
        }
      });
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
    // height: 72px;
    // line-height: 72px;
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