<template>
  <common-modal
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm"
    :loading="loading"
  >
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


    this.rules = {};
    return {
      formItemList: [
        {
          label: "管理员",
          model: "name",
          type: "input",
          placeholder: "请填写管理员姓名"
        },
        {
          label: "邮箱",
          model: "address",
          type: "input",
          placeholder: "请填写邮箱地址"
        }
      ],
      formModel: {},
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "管理员邮箱";
    },
    isEdit() {
      return !!this.links.update;
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        return;
      }

      if (this.links.update) {
        this.formItemList.find(item => {
          if (item.model === "name") {
            item.type = "text"
          }
        })
        this.$get({ url: this.links.self }).then(res => {
          this.formModel = res;
        }).catch();
      } else {
          this.formItemList.find(item => {
          if (item.model === "name") {
            item.type = "input"
          }
        })
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      if (!val) {
        // 关闭弹窗
        // console.log(val)
        this.$refs.formInline.resetFields();
      }

      this.$emit("update:visible", val);
    }
  },

  created() {
    // console.log(this.links.update) // ranck？为什么呢会直接运行了 
  },

  methods: {

    handleConfirm() {
      this.loading = true;
      if (this.isEdit) {
        this.$put({ url: this.links.update, params: this.formModel }).then(res => {
          this.$$success("编辑成功");
          this.$emit("success");
          this.dialogVisible = false;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$$error(err.response.data.message);
        });
      } else {
        this.$post({ url: this.links.self, params: this.formModel }).then(res => {
          this.$$success("新建成功");
          this.$emit("success");
          this.dialogVisible = false;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$$error(err.response.data.message);
        });
      }

    }

  }
};
</script>

<style lang="less">
</style>