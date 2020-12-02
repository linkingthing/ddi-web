<template>
  <div class="device-detect">
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
          <label class="condition-item-label">设备名称</label>
          <Input
            v-model="condition.name"
            placeholder="请输入设备名称"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">管理地址</label>
          <Input
            v-model="condition.administrationAddress"
            placeholder="请输入管理地址"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

        <div class="condition-item">
          <label class="condition-item-label">设备类型</label>
          <Select
            style="width: 160px"
            v-model="condition.equipmentType"
            @on-change="handleQuery"
            clearable
          >
            <Option
              v-for="item in deviceTypes"
              :key="item.label"
              :value="item.label"
            >{{item.text}}</Option>
          </Select>
        </div>

        <div class="condition-item">
          <label class="condition-item-label">厂商</label>
          <Input
            v-model="condition.manufacturer"
            placeholder="请输入厂商"
            class="top-input"
            @on-enter="handleQuery"
          />
        </div>

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
          v-if="$hasPermissionCreate('networkequipment')"
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

    <Detect
      :visible.sync="showDetect"
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
        <div class="base-upload-filename">{{file.name}}</div>
        <div>

          <Upload
            ref="upload"
            action="/uploadfile"
            :headers="headers"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :show-upload-list="false"
            name="path"
          >
            <Button size="small">
              <img
                src="./icon-file.png"
                alt=""
                style="vertical-align: bottom;margin-right: 6px;"
              >浏览文件</Button>
          </Upload>
        </div>
      </div>
    </common-modal>
  </div>
</template>

<script>
import Edit from "./edit";
import Detect from "./detect";
import AdvancedSearch from "./advanced-query";

import { columns, deviceTypes } from "./define";
import { downloadFile } from "@/util/common";


export default {
  components: {
    Edit,
    Detect,
    AdvancedSearch
  },

  data() {
    this.headers = {
      Authorization: this.$store.getters.token
    };
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      deviceTypes,
      condition: {
        // name: "",
        // administrationAddress: "",
        // equipmentType: "",
        // manufacturer: ""
      },
      tableData: [],
      columns: columns(this),
      showAdvance: false,
      showEdit: false,
      showDetect: false,
      currentData: null,
      current: 0,
      total: 0,
      always: false,
      importVisible: false,
      links: {
        self: ""
      },
      uploadParams: {
        name: ""
      },
      file: ""

    };
  },

  watch: {
    current() {
      this.handleQuery();
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
      this.loading = true;

      if (params.administrationAddress) {
        params.administration_address = params.administrationAddress;
      }

      if (params.equipmentType) {
        params.equipment_type = params.equipmentType;
      }


      Reflect.deleteProperty(params, "administrationAddress");
      Reflect.deleteProperty(params, "equipmentType");

      try {
        const aparams = {
          page_num: this.current,
          page_size: 10
        };
        let res = await this.$get({ url: this.$formatQuerys(params, this.url), params: aparams });

        this.tableData = res.data.map(item => {
          const equipmentType = deviceTypes.find(({ label }) => label === item.equipmentType);

          item.equipmentTypeText = equipmentType ? equipmentType.text : "";

          return item;
        });

        this.total = res.pagination.total;
        this.links = res.links;

        if (!Object.is(this.current, res.pagination.pageNum)) {
          this.current = res.pagination.pageNum;
        }
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
    handleClickImportTable() {
      this.file = "";
      this.uploadParams = { name: "" };
      this.importVisible = true;
    },
    beforeUpload(file) {
      // 上传前校验
      // this.file = file;
      // console.log(file)
      // return false; // 阻止上传
    },
    uploadSuccess(response, file) {
      this.uploadParams = { name: response.filename };
      this.file = file;
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
        this.handleQuery();
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

    handleDetect(res) {
      this.showDetect = true;
      this.currentData = { ...res };
    },

    handleSaved() {
      this.showCreate = false;

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
@import "./index.less";
.import-export-tooltip {
  .ivu-tooltip-inner {
    padding: 0;
  }
  .import-export-menu {
    white-space: nowrap;
    .import-export-menu-item {
      width: 160px;
      padding: 16px 20px;
      line-height: 20px;
      display: flex;
      cursor: pointer;
      img {
        margin-right: 16px;
      }
      + .import-export-menu-item {
        border-top: #aaa solid 1px;
      }
    }
  }
}
</style>