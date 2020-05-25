<template>
  <common-modal
    class="view-modal"
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

      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
      />

    </Form>
  </common-modal>
</template>

<script>
import { commonNameValidate } from "@/util/common";
import { resStringToArray, resArrayToString } from "@/util/parser";

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


    this.rules = {
      name: [
        { required: true, message: "请填视图名称" },
        {
          type: "string",
          max: 19,
          message: "最多只能19个字符"
        }
      ]

    };
    return {
      formModel: {
        status: "allow"
      },
      loading: false,
      dialogVisible: false,
      acl: [],
      formItemList: [
        {
          label: "视图名称",
          model: "name",
          type: "input",
          placeholder: "请填写域名"
        },
        {
          label: "ACL规则",
          model: "acls",
          type: "select",
          multiple: true,
          placeholder: "请选择ACL规则",
          children: []
        },
        {
          label: "DNS64",
          model: "dns64",
          type: "input",
          placeholder: "请填写DNS64"
        },
        {
          label: "备注",
          model: "comment",
          type: "input",
          placeholder: "请填写备注信息"
        }
      ]
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "视图";
    },
    isEdit() {
      return !!this.links.update;
    }

  },

  watch: {
    visible(val) {
      if (!val) {
        this.formModel = {};
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, dns64, acls, comment, priority }) => {
          this.formModel = {
            name,
            acls,
            comment,
            dns64,
            priority
          };
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },


    acl(val) {

      const aclOptions = val.map(item => {
        return {
          label: item.id,
          text: item.name
        };
      });

      this.formItemList.some(item => {
        if (item.model === "acls") {
          item.children = aclOptions;
        }
      });
    }
  },

  created() {
    this.$get({ url: "/apis/linkingthing.com/dns/v1/acls" }).then(res => {
      this.acl = res;
    });
  },

  methods: {

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = { ...this.formModel };

          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(res => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            });
          } else {
            params.priority = 1;
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
.view-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>