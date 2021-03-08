<template>
  <div class="import-export-csv">
    <Tooltip
      placement="bottom-end"
      :always="always"
      class="import-export-tooltip"
    >

      <template
        v-slot:default
        v-if="$slots.default"
      >
        <slot />
      </template>
      <Button
        type="primary"
        v-else
      >
        {{title}}
      </Button>
      <div slot="content">
        <div class="import-export-menu">
          <div
            v-if="!downloadOnly"
            class="import-export-menu-item"
            @click="handleClickImportTable"
          >
            <img
              src="./import.png"
              alt=""
            > 导入{{resource}}表格
          </div>
          <div
            class="import-export-menu-item"
            @click="handleClickExportTable"
          >
            <img
              src="./export.png"
              alt=""
            > 导出{{resource}}表格
          </div>
          <div
            class="import-export-menu-item"
            @click="handleClickDownloadTemplate"
          >
            <img
              src="./template.png"
              alt=""
            > {{resource}}表格模板
          </div>
        </div>
      </div>
    </Tooltip>
    <common-modal
      :visible.sync="importVisible"
      :width="415"
      :title="`导入${resource}表格`"
      @confirm="handleUpload"
      :loading="loading"
    >
      <div class="tips-info">
        <img
          class="tips-info-icon"
          src="./icon-info.png"
          alt=""
        >
        <span>请使用为您准备的“{{resource}}表格模板”填写{{resource}}信息</span>
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

import { downloadFile } from "@/util/common";


export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "导入/导出"
    },
    resource: {
      type: String,
      default: "资源"
    },
    links: {
      type: Object,
      default: () => ({ self: "" })
    },
    downloadOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.headers = {
      Authorization: this.$store.getters.token
    };
    return {
      importVisible: false,
      always: false,
      loading: false,
      file: ""
    };
  },
  computed: {},
  watch: {},
  created() {
    console.log(this)
  },
  mounted() { },
  methods: {
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
      this.loading = true;
      this.$post({ url, params }).then(() => {
        this.$Message.success("指定成功"); // 指定csv所在路径
        this.importVisible = false;
        this.always = false;
        this.loading = false;

        this.$emit("on-upload-success");
        this.$emit("on-import-success");
      }).catch(err => {
        this.loading = false;
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
    }
  }
};
</script>

<style lang="less">
.import-export-csv {
  display: inline-block;
}
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
.tips-info {
  height: 26px;
  font-size: 12px;
  color: #888;
  border-radius: 3px;
  padding: 6px;
  line-height: 14px;
  background-color: #f1f1f1;
  .tips-info-icon {
    vertical-align: bottom;
    margin-right: 6px;
  }
}
</style>