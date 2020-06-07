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
      :label-width="80"
      :label-colon="true"
      :rules="rules"
      :model="formModel"
    >

      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
        :show-fields="isEdit ? ['name'] : []"
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
        label: "组名称",
        model: "name",
        type: "input",
        placeholder: "请填写组名称"
      },
      {
        label: "服务器",
        model: "ips",
        type: "textarea",
        placeholder: "可以添加多个转发服务器，多个服务器必 须用换行符分隔，每次最多填写10条",
        autosize: { minRows: 4, maxRows: 8 }
      },

      {
        label: "备注",
        model: "comment",
        type: "input",
        placeholder: "请填写备注"
      }
    ];

    this.rules = {
      name: [
        { required: true, message: "请填写组名称" }
      ]
    };
    return {
      formModel: {
        zonetype: "master",
        ips: "",
        name: ""
      },
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "组";
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
        this.$get({ url: this.links.self }).then(({ name, ips, comment }) => {
          this.formModel = {
            name,
            ips: ips.join(","),
            comment
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

    handleConfirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = { ...this.formModel };
          params.ips = typeof params.ips === "string" ? params.ips.split(",") : [];
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
}
</style>