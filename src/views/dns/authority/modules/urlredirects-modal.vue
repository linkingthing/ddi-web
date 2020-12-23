<template>
  <common-modal
    class="zone-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('formInline')"
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
        label="域名"
        prop="domain"
      >
        <span v-if="isEdit">{{formModel.isHttps}}://{{formModel.domain}}</span>
        <Input
          v-model="formModel.domain"
          v-else
        >
        <Select
          v-model="formModel.isHttps"
          slot="prepend"
          style="width: 80px"
        >
          <Option value="http">http</Option>
          <Option value="https">https</Option>
        </Select>
        </Input>
      </FormItem>

      <FormItem
        prop="file"
        class="upload-box"
        v-if="formModel.isHttps === 'https' && !!formModel.domain && !isEdit"
      >

        <Upload
          ref="keyUpload"
          action="/uploadfile"
          :headers="headers"
          :on-success="keyUploadSuccess"
          :before-upload="keyUploadBefore"
          :data="{directory: formModel.domain}"
          name="path"
          :show-upload-list="false"
        >

          <Button
            type="primary"
            size="small"
          >.key密钥</Button>
          <div
            class="upload-show"
            v-if="keyFile"
          >
            <span class="upload-filename">{{keyFile.name}}</span>
            <img
              class="upload-close"
              src="./icon-close.png"
              @click.stop="handleDeleteFile('keyFile')"
            >
          </div>
        </Upload>
        <Upload
          ref="crtUpload"
          action="/uploadfile"
          :headers="headers"
          :on-success="crtUploadSuccess"
          :before-upload="crtUploadBefore"
          :data="{directory: formModel.domain}"
          name="path"
        >
          <Button
            type="primary"
            size="small"
            ghost
          >.crt证书</Button>
          <div
            class="upload-show"
            v-if="crtFile"
          >
            <span class="upload-filename">{{crtFile.name}}</span>
            <img
              class="upload-close"
              src="./icon-close.png"
              @click.stop="handleDeleteFile('crtFile')"
            >
          </div>
        </Upload>
      </FormItem>
      <FormItem
        label="重定向URL"
        prop="url"
      >
        <Input v-model="formModel.url" />
      </FormItem>

    </Form>
  </common-modal>
</template>

<script>
import { domainReg, urlReg } from "@/util/common";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    links: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    this.headers = {
      Authorization: this.$store.getters.token
    };

    this.formItemList = [
      {
        label: "域名",
        model: "domain",
        type: "input",
        placeholder: "请填写区域名"
      },
      {
        label: "重定向URL",
        model: "url",
        type: "input",
        placeholder: "请填写区重定向URL"
      }
    ];

    this.rules = {
      domain: [
        { required: true, message: "请填写域名" },
        { pattern: domainReg, message: "请输入正确的域名" }
      ],
      url: [
        { required: true, message: "请输入url" },
        { pattern: urlReg, message: "请输入正确的url" }
      ],
      file: [
        {
          validator: (rule, value, callback) => {
            if (!this.keyFile) {
              callback("请上传.key密钥");
            }
            if (!this.crtFile) {
              callback("请上传.crtFile证书");
            }
            callback();
          }
        }
      ]

    };
    return {
      formModel: {
        domain: "",
        url: "",
        isHttps: "http",
        keyFile: "",
        crtFile: ""
      },
      loading: false,
      dialogVisible: false,
      keyFile: "",
      crtFile: ""
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "URL重定向";
    },
    isEdit() {
      return !!this.links.update;
    },
    isHttps() {
      return this.formModel.isHttps === "https";
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        this.formModel.isHttps = "http";
        this.keyFile = null;
        this.crtFile = null;
        this.formModel.keyFile = null;
        this.formModel.crtFile = null;
        this.$refs.formInline.resetFields();
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ domain, url, isHttps }) => {
          this.formModel = {
            domain, url, isHttps
          };
          this.formModel.isHttps = isHttps ? "https" : "http";

          this.$nextTick().then(() => {
            this.$refs.formInline.validate();
          });
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    }
  },

  created() {

  },

  methods: {
    keyUploadBefore(file) {
      this.keyFile = file;
      return false;
    },
    keyUploadSuccess(response) {
      this.formModel.keyFile = response.filename;
      this.count++;
      this.controllerSubmit();
    },
    handleDeleteFile(file) {
      this[file] = "";
    },
    crtUploadBefore(file) {
      this.crtFile = file;
      return false;
    },
    crtUploadSuccess(response) {
      this.formModel.crtFile = response.filename;
      this.count++;
      this.controllerSubmit();
    },

    uploadFile() {
      if (this.isHttps) {
        this.$refs.keyUpload.clearFiles();
        this.$refs.crtUpload.clearFiles();
        return Promise.all([this.$refs.keyUpload.post(this.keyFile), this.$refs.crtUpload.post(this.crtFile)]);
      } else {
        this.count = 2;
        return Promise.resolve(1);
      }
    },
    handleConfirm(name) {
      this.count = 0;
      this.uploadFile().then(() => {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.controllerSubmit();
          }
        });
      }).catch(() => {
        this.count = 0;
        this.$refs.keyUpload.clearFiles();
        this.$refs.crtUpload.clearFiles();
        this.keyFile = null;
        this.crtFile = null;
        this.formModel.keyFile = null;
        this.formModel.crtFile = null;
      });
    },
    controllerSubmit() {
      if (this.count === 2) {
        this.submit();
      }
    },
    submit() {
      this.loading = true;
      const params = { ...this.formModel };
      params.isHttps = params.isHttps === "https";
      this.$nextTick().then(() => {

        if (this.isEdit) {
          this.$put({ url: this.links.update, params }).then(res => {
            this.$$success("编辑成功");
            this.$emit("success");
            this.dialogVisible = false;
            this.loading = false;
          }).catch(err => {
            this.loading = false;
            this.$$error(err.response.data.message);
          });
        } else {
          this.$post({ url: this.links.self, params }).then(res => {
            this.$$success("新建成功");
            this.$emit("success");
            this.dialogVisible = false;
            this.loading = false;
          }).catch(err => {
            this.loading = false;
            this.$$error(err.response.data.message);
          });
        }

      });
    }

  }
};
</script>

<style lang="less">
.zone-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }

  .upload-box {
    margin-top: -10px;
    .ivu-form-item-content {
      display: flex;
      justify-content: space-between;
    }
    .ivu-btn {
      width: 130px;
    }
  }
}

.upload-show {
  display: flex;
  height: 20px;
  padding: 2px 5px;
  background: #f9f2e2;
  color: #de9f32;
  border-radius: 3px;

  .upload-filename {
    display: block;
    width: 100px;
    font-size: 12px;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
  .upload-close {
    display: block;
    width: 12px;
    height: 12px;
    margin-top: 2px;
    margin-left: auto;
    cursor: pointer;
  }
}
</style>