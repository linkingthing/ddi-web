<template>
  <common-modal
    class="zone-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('formInline')"
  >
    <IviewLoading v-if="loading" />
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
        <span v-if="isEdit">{{formModel.domain}}</span>
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
        class="upload-box"
        v-if="formModel.isHttps === 'https' && !!formModel.domain && !isEdit"
      >

        <Upload
          ref="keyUpload"
          action="/uploadfile"
          :headers="headers"
          :on-success="keyUploadSuccess"
          :before-upload="$refs.keyUpload && $refs.keyUpload.clearFiles"
          :data="{directory: formModel.domain}"
          name="path"
        >
          <!-- :show-upload-list="false" -->

          <Button
            type="primary"
            size="small"
          >.key密钥</Button>
        </Upload>
        <Upload
          ref="crtUpload"
          action="/uploadfile"
          :headers="headers"
          :on-success="crtUploadSuccess"
          :before-upload="()=> { $refs.crtUpload && $refs.crtUpload.clearFiles()}"
          :data="{directory: formModel.domain}"
          name="path"
        >
          <Button
            type="primary"
            size="small"
            ghost
          >.crt证书</Button>
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
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "URL重定向";
    },
    isEdit() {
      return !!this.links.update;
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        this.formModel.isHttps = "http";
        this.$refs.formInline.resetFields();
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ domain, url, isHttps }) => {
          this.formModel = {
            domain, url, isHttps
          };

          this.formModel.isHttps = isHttps ? "https" : "http";
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
    keyUploadSuccess(response) {
      this.formModel.keyFile = response.filename;
    },
    crtUploadSuccess(response) {
      this.formModel.crtFile = response.filename;
    },
    handleConfirm(name) {

      this.$refs[name].validate(valid => {
        if (valid) {
          const params = { ...this.formModel };
          params.isHttps = params.isHttps === "https";

          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(res => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            });
          } else {
            this.$post({ url: this.links.self, params }).then(res => {
              this.$$success("新建成功");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            });
          }
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
      width: 110px;
    }
  }
}
</style>