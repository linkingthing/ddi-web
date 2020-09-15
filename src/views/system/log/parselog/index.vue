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
        >FTP导出</Button>

        <common-modal
          class="acl-modal"
          :visible.sync="dialogVisible"
          title="ftp导出"
          :width="413"
          @confirm="handleConfirm('formInline')"
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
            <FormItem>
              <Button
                type="primary"
                @click="handleCreateLog('formInline')"
              >导出解析日志</Button>
            </FormItem>
            <FormItem>
              {{status}}
            </FormItem>

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
    this.buttonConfig = [{
      label: "取消",
      type: "default",
      class: "button-cancel",
      event: "cancel"
    },
    {
      label: "上传",
      type: "primary",
      class: "button-confirm",
      event: "confirm"
    }];
    this.rules = {

    };
    return {
      dialogVisible: false,
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
      showConfig: false,
      formModel: {
        address: "",
        userName: "",
        password: ""
      },
      status: ""
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
      this.dialogVisible = true;
      this.$get(this.$getApiByRoute("/system/log/uploadlogs")).then(res => {
        const { data } = res;
        if (Array.isArray(data) && data.length) {
          const { userName, address, password, status } = data[0];
          this.formModel.userName = userName;
          this.formModel.address = address;
          this.formModel.password = password;

          this.status = status;
        }
      });
    },
    handleCreateLog(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = this.formModel;
          let { url } = this.$getApiByRoute("/system/log/uploadlogs");
          url += "/1?action=uploadLog";
          this.$post({ params, url }).then(({ status }) => {
            this.status = status;
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        }
      });
    },
    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = this.formModel;
          let { url } = this.$getApiByRoute("/system/log/uploadlogs");
          url += "/user";

          this.$put({ params, url }).then(res => {
            this.$Message.success("配置保存成功");
            this.dialogVisible = false;
          }).catch(err => {
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