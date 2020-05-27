<template>
  <common-modal
    class="zone-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />
    <Form
      ref="formInline"
      label-position="left"
      :label-width="80"
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
    this.formItemList = [
      {
        label: "区名称",
        model: "name",
        type: "input",
        placeholder: "请填写区名称"
      },
      {
        label: "区类型",
        model: "isarpa",
        type: "radio",
        placeholder: "请填写前缀长度",
        children: [{
          label: "false",
          text: "正向区"
        },
        {
          label: "true",
          text: "反向区"
        }]
      },
      {
        label: "TTL",
        model: "ttl",
        type: "number",
        placeholder: "请填写TTL"
      },
      {
        label: "备注",
        model: "comment",
        type: "input",
        placeholder: "请填写备注"
      }
    ];

    this.rules = {};
    return {
      formModel: {
        zonetype: "master"
      },
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "区";
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
        this.$get({ url: this.links.self }).then(({ name, isarpa, ttl, comment, zonetype }) => {
          this.formModel = {
            name,
            ttl,
            comment,
            isarpa: `${isarpa}`,
            zonetype
          };
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

    handleConfirm() {

      const params = { ...this.formModel };
      params.isarpa = params.isarpa === "true";

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

  }
};
</script>

<style lang="less">
.zone-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>