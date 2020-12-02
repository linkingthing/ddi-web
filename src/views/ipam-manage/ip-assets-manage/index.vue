<template>
  <div class="ip-assets-manage">
    <div class="color-card">
      <div class="color-card-item">
        <label for="">终端状态指示：</label>
        <div>
          <Badge
            color="#51CA3D"
            text="在线"
          />
          <Badge
            color="#EF2E2E"
            text="异常"
          />
          <Badge
            color="#999999"
            text="离线"
          />

        </div>
      </div>
      <div class="color-card-item">
        <label for="">IP状态指示：</label>
        <div>
          <Badge
            color="#1EE9CA"
            text="活跃地址"
          />
          <Badge
            color="#FF6464"
            text="冲突地址"
          />
          <Badge
            color="#1272FF"
            text="不活跃地址"
          />
          <Badge
            color="#FFB83C"
            text="僵尸地址"
          />
        </div>
      </div>
    </div>
    <IviewLoading v-if="loading" />

    <table-page
      :data="tableData"
      :columns="columns"
      :is-padding-top="true"
      :total="total"
      :current.sync="current"
    >
      <template slot="top-left">
        <div class="condition-item">
          <label class="condition-item-label">MAC</label>
          <Input
            v-model="condition.mac"
            placeholder="请输入MAC地址"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <!-- <div class="condition-item">
          <label class="condition-item-label">终端状态</label>
          <Select
            v-model="condition.deviceState"
            style="width:100px"
            class="top-input"
          >
            <Option
              v-for="item in deviceStateList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div> -->

        <div class="condition-item">
          <label class="condition-item-label">IP地址</label>
          <Input
            v-model="condition.ip"
            placeholder="请输入IP地址"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">终端名称</label>
          <Input
            v-model="condition.name"
            placeholder="请输入终端名称"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <!-- <div class="condition-item">
          <label class="condition-item-label">上联设备</label>
          <Input
            v-model="condition.switchName"
            placeholder="请输入上联设备"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div> -->

        <btn-search
          type="primary"
          @click="handleQuery"
        >
          搜索
        </btn-search>
      </template>

      <template slot="top-right">
        <!-- <Button
          class="top-button"
          @click="showAdvance = true"
        >
          高级搜索
        </Button> -->

        <Button
          v-if="$hasPermissionCreate('asset')"
          type="primary"
          @click="handleAdd"
          class="top-button"
        >
          新建
        </Button>
        <Tooltip
          placement="bottom-end"
          :always="always"
          class="import-export-tooltip"
        >
          <Button
            type="primary"
            @click="handleOpenImport"
            class="top-button"
          >
            导入/导出
          </Button>
          <div slot="content">
            <div class="import-export-menu">
              <div
                class="import-export-menu-item"
                @click="handleClickImportTable"
              >
                <img
                  src="./import.png"
                  alt=""
                > 导入终端表格
              </div>
              <div
                class="import-export-menu-item"
                @click="handleClickExportTable"
              >
                <img
                  src="./export.png"
                  alt=""
                > 导出终端表格
              </div>
              <div
                class="import-export-menu-item"
                @click="handleClickDownloadTemplate"
              >
                <img
                  src="./template.png"
                  alt=""
                > 终端表格模板
              </div>
            </div>
          </div>
        </Tooltip>

      </template>
    </table-page>

    <Edit
      :visible.sync="showEdit"
      :data="currentData"
      @saved="handleSaved"
    />

    <AdvancedSearch
      :visible.sync="showAdvance"
      @comfirmed="handleAdvancedQuery"
    />

    <common-modal
      :visible.sync="importVisible"
      :width="415"
      title="导入终端表格"
      @confirm="handleUpload"
    >
      <div class="tips-info">
        <img
          class="tips-info-icon"
          src="./icon-info.png"
          alt=""
        >
        <span>请使用为您准备的“终端表格模板”填写终端信息</span>
      </div>

      <div class="base-upload">

        <!-- <div class="base-upload-filename">{{file.name}}</div> -->
        <!-- <div> -->
        <Input
          style="width: 100%"
          placeholder="请输入文件路径"
          v-model="uploadParams.path"
        />

        <!-- <Upload
            ref="upload"
            :action="`${links.self}?action=importcsv`"
            :before-upload="beforeUpload"
          >
            <Button size="small">
              <img
                src="./icon-file.png"
                alt=""
                style="vertical-align: bottom;margin-right: 6px;"
              >浏览文件</Button>
          </Upload> -->
        <!-- </div> -->
      </div>
    </common-modal>

  </div>
</template>

<style lang="less">
@import "index.less";
</style>

<script>
import Edit from "./edit";
import AdvancedSearch from "./advanced-query";

import { columns, deviceTypes } from "./define";

import { ipv4IsValid, downloadFile } from "@/util/common";

export default {
  components: {
    Edit,
    AdvancedSearch
  },

  data() {
    this.deviceStateList = [
      {
        label: "在线",
        value: "online"
      },
      {
        label: "离线",
        value: "offline"
      },
      {
        label: "异常",
        value: "abnormal"
      }
    ];
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      deviceTypes: [{ text: "全部", label: "全部" }, ...deviceTypes],
      condition: {
        mac: "",
        deviceType: "全部"
      },
      tableData: [],
      columns: columns(this),
      showAdvance: false,
      showEdit: false,
      currentData: null,
      total: 0,
      current: 0,

      always: false,
      importVisible: false,
      file: "",
      links: {
        self: ""
      },
      uploadParams: {
        path: ""
      }
    };
  },
  watch: {
    current() {
      this.handleQuery();
    }
  },

  async mounted() {

    const {
      id,
      ip,
      mac,
      switchName,
      switchPort,
      computerRack,
      computerRoom,
      subnet,
      vlanId
    } = this.$route.query;

    this.currentData = {
      mac,
      switchName,
      switchPort,
      computerRack,
      computerRoom,
      ip,
      subnet,
      vlanId
    };

    if (id) {
      try {
        let data = await this.$get({ url: this.url + "/" + id });

        this.currentData = {
          ...data,
          ...this.currentData
        };

        this.currentData.shouldRegister = true;

      } catch (err) {
        this.$handleError(err);
      }
    } else {
      if (ip) {
        if (ipv4IsValid(ip)) {
          this.currentData.ipv4s = [ip];
        } else {
          this.currentData.ipv6s = [ip];
        }
      }

    }

    if (mac) {
      this.showEdit = true;
    }
  },

  methods: {
    handleAdvancedQuery(res) {
      this.queryData({
        ...this.condition,
        ...res
      });
    },

    handleQuery() {
      this.queryData();
    },

    async queryData(params = { ...this.condition }) {

      if (params.ip) {
        if (ipv4IsValid(params.ip)) {
          params.ipv4 = params.ip;
        } else {
          params.ipv6 = params.ip;
        }
      }

      if (params.switchName) {
        params.switch_name = params.switchName;
      }

      this.loading = true;

      try {
        let { url, condition } = this;

        let { deviceType } = condition;

        if (deviceType === "全部") {
          deviceType = "";
        }

        const aparams = {
          page_num: this.current,
          page_size: 10
        };
        let { data, pagination, links } = await this.$get({ url: this.$formatQuerys({ ...params, deviceType }, url), params: aparams });
        this.links = links;
        this.tableData = data.map(item => {
          const type = deviceTypes.find(({ label }) => label === item.deviceType);

          item.deviceTypeText = type ? type.text : "";
          // item.showipv4s = item.ipv4s.length ? `[\n${item.ipv4s.join("," + "\n")}\n]` : "";
          // item.showipv6s = item.ipv6s.length ? `[\n${item.ipv6s.join("," + "\n")}\n]` : "";

          return item;
        });
        this.total = pagination.total;
        this.current = pagination.pageNum;
      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    },

    handleGoto({ link, ip, ipstate }) {
      const path = this.$getRouteByLink(link, "address");
      this.$router.push({
        path,
        query: {
          ip,
          ipstate
        }
      })
    },

    handleAdd() {
      this.showEdit = true;
      this.currentData = null;
    },

    handleOpenImport() {
      // this.always = !this.always;
    },
    handleClickImportTable() {
      this.importVisible = true;
    },
    beforeUpload(file) {
      this.file = file;
      return false;
    },
    handleUpload() {
      // console.log(this.$refs.upload);
      // this.$refs.upload.post(this.file);
      const url = `${this.links.self}?action=importcsv`;
      const params = this.uploadParams;
      this.$post({ url, params }).then(() => {
        this.$Message.success("指定成功"); // 指定csv所在路径
        this.importVisible = false;
        this.always = false;
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    },
    handleClickExportTable() {
      const url = `${this.links.self}?action=exportcsv`;
      this.$post({ url }).then(({ path }) => {
        downloadFile(path);
      });
    },
    handleClickDownloadTemplate() {
      const url = `${this.links.self}?action=exportcsvtemplate`;
      this.$post({ url }).then(({ path }) => {
        downloadFile(path);
      });
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

<style lang="less">
.color-card {
  display: inline-flex;
  height: 60px;
  align-items: center;
  float: right;
  .color-card-item {
    .ivu-badge {
      margin: 0 15px 0 10px;
    }


    display: flex;
    font-size: 12px;
    color: #333;
    padding: 0 20px;
    &:last-child {
      border-left: 1px solid #ddd;
    }
  }
}
</style>